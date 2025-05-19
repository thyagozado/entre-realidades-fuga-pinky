// AudioManagerCore: versão sem React, para uso como singleton global

interface ActiveSound {
  source: AudioBufferSourceNode;
  gainNode: GainNode;
  filePath: string;
  isPlaying: boolean;
}

interface PlaySoundRequest {
  filePath: string;
  loop?: boolean;
  fadeInDuration?: number;
  volume?: number;
  forceRestart?: boolean;
  timestamp?: number;
}

// Variáveis internas do singleton
let audioContext: AudioContext | null = null;
const activeSounds: Map<string, ActiveSound> = new Map();
const loadedBuffers: Map<string, AudioBuffer> = new Map();
let isContextResumedByGesture = false;
let pendingPlayRequests: PlaySoundRequest[] = [];
let playSoundInternal: ((request: PlaySoundRequest) => Promise<AudioBufferSourceNode | null>) | null = null;

function processPendingPlayRequests() {
  if (audioContext?.state === 'running') {
    const requestsToProcess = [...pendingPlayRequests];
    pendingPlayRequests = [];
    if (requestsToProcess.length > 0) {
      console.log(`[AudioManager] Processing ${requestsToProcess.length} pending play requests.`);
      requestsToProcess.forEach(request => {
        if (audioContext?.state === 'running' && playSoundInternal) {
          console.log('[AudioManager] Re-attempting play for pending request:', request.filePath);
          playSoundInternal(request);
        } else {
          console.warn('[AudioManager] Context not running or playSoundInternal not ready when trying to process pending request for:', request.filePath);
        }
      });
    }
  }
}

function tryResumeAudioContext() {
  if (audioContext && audioContext.state === 'suspended') {
    console.log('[AudioManager] Attempting to resume AudioContext due to user gesture...');
    audioContext.resume().then(() => {
      console.log('[AudioManager] AudioContext resumed successfully after user gesture. State:', audioContext?.state);
      isContextResumedByGesture = true;
      processPendingPlayRequests();
    }).catch(e => console.error('[AudioManager] Error resuming AudioContext on user gesture:', e));
  } else if (audioContext && audioContext.state === 'running') {
    isContextResumedByGesture = true;
    processPendingPlayRequests();
  }
}

function getAudioContext(): Promise<AudioContext | null> {
  return new Promise((resolve) => {
    if (!audioContext || audioContext.state === 'closed') {
      console.log('[AudioManager] AudioContext is null or closed, re-initializing.');
      try {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        console.log('[AudioManager] AudioContext re-initialized. State:', audioContext.state);
        isContextResumedByGesture = audioContext.state === 'running';
        if (audioContext.state === 'suspended' && !isContextResumedByGesture) {
          console.warn('[AudioManager] getAudioContext: Newly re-initialized context is suspended. A user gesture is required.');
        }
      } catch (e) {
        console.error('[AudioManager] Error re-initializing AudioContext:', e);
        resolve(null);
        return;
      }
    }
    if (audioContext.state === 'suspended') {
      if (isContextResumedByGesture) {
        console.log('[AudioManager] getAudioContext: Context suspended, but gesture recorded. Attempting resume.');
        audioContext.resume().then(() => {
          console.log('[AudioManager] getAudioContext: AudioContext resumed. New state:', audioContext.state);
          resolve(audioContext);
        }).catch(e => {
          console.error('[AudioManager] getAudioContext: Error resuming:', e);
          resolve(audioContext);
        });
        return;
      } else {
        console.warn('[AudioManager] getAudioContext: Context is suspended. Waiting for user gesture.');
      }
    }
    if (audioContext && audioContext.state === 'closed') {
      console.warn('[AudioManager] AudioContext became closed.');
      resolve(null);
      return;
    }
    resolve(audioContext);
  });
}

async function loadSound(filePath: string): Promise<AudioBuffer | null> {
  console.log(`[AudioManager] loadSound: Attempting to load sound: ${filePath}`);
  if (loadedBuffers.has(filePath)) {
    console.log(`[AudioManager] loadSound: Sound already loaded (cache): ${filePath}`);
    return loadedBuffers.get(filePath)!;
  }
  const context = await getAudioContext();
  if (!context) {
    console.error('[AudioManager] loadSound: AudioContext not available for loading.');
    return null;
  }
  if (context.state !== 'running') {
    console.warn(`[AudioManager] loadSound: AudioContext is not running (state: ${context.state}). Sound loading for ${filePath} might be delayed or fail until user interaction.`);
  }
  console.log(`[AudioManager] loadSound: Fetching sound: ${filePath}`);
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${filePath}: ${response.statusText} (${response.status})`);
    }
    const arrayBuffer = await response.arrayBuffer();
    console.log(`[AudioManager] loadSound: Decoding audio data for: ${filePath}`);
    if (context.state === 'closed') {
      console.error(`[AudioManager] loadSound: AudioContext closed before decoding ${filePath}.`);
      return null;
    }
    const audioBuffer = await context.decodeAudioData(arrayBuffer);
    loadedBuffers.set(filePath, audioBuffer);
    console.log(`[AudioManager] loadSound: Sound loaded and decoded: ${filePath}`);
    return audioBuffer;
  } catch (error) {
    console.error(`[AudioManager] loadSound: Error loading sound ${filePath}:`, error);
    return null;
  }
}

async function internalPlayLogic(request: PlaySoundRequest): Promise<AudioBufferSourceNode | null> {
  const { filePath, loop = false, fadeInDuration = 0, volume = 1, forceRestart = false } = request;
  const context = audioContext;
  if (!context || context.state !== 'running') {
    console.error(`[AudioManager] internalPlayLogic: Context not running for ${filePath}. State: ${context?.state}. Aborting.`);
    if (context && context.state === 'suspended' && !isContextResumedByGesture) {
      console.log(`[AudioManager] internalPlayLogic: Context suspended, re-queuing ${filePath}`);
      pendingPlayRequests.push({ ...request, timestamp: Date.now() });
    }
    return null;
  }
  const existingSound = activeSounds.get(filePath);
  if (existingSound?.isPlaying && !forceRestart) {
    console.warn(`[AudioManager] internalPlayLogic: ${filePath} already playing. Not restarting.`);
    return existingSound.source;
  }
  if (existingSound?.isPlaying && forceRestart) {
    console.log(`[AudioManager] internalPlayLogic: Force restarting ${filePath}`);
    try { existingSound.source.onended = null; existingSound.source.stop(); } catch (e) { /* ... */ }
    activeSounds.delete(filePath);
  }
  try {
    const audioBuffer = await loadSound(filePath);
    if (!audioBuffer) {
      console.error(`[AudioManager] internalPlayLogic: No audioBuffer for ${filePath}`);
      return null;
    }
    if (audioContext?.state !== 'running') {
      console.error('[AudioManager] internalPlayLogic: Context became non-running before source creation for', filePath);
      if (audioContext?.state === 'suspended' && !isContextResumedByGesture) {
        console.log(`[AudioManager] internalPlayLogic: Re-queuing ${filePath} as context is suspended again.`);
        pendingPlayRequests.push({ ...request, timestamp: Date.now() });
      }
      return null;
    }
    const source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.loop = loop;
    const gainNode = context.createGain();
    gainNode.gain.setValueAtTime(fadeInDuration > 0 ? 0.0001 : volume, context.currentTime);
    source.connect(gainNode);
    gainNode.connect(context.destination);
    console.log(`[AudioManager] internalPlayLogic: Starting sound: ${filePath} at time: ${context.currentTime}`);
    source.start(0);
    if (fadeInDuration > 0) {
      console.log(`[AudioManager] internalPlayLogic: Applying fade-in for ${filePath} over ${fadeInDuration}s to volume ${volume}`);
      gainNode.gain.linearRampToValueAtTime(volume, context.currentTime + fadeInDuration);
    }
    const soundData: ActiveSound = { source, gainNode, filePath, isPlaying: true };
    activeSounds.set(filePath, soundData);
    console.log(`[AudioManager] internalPlayLogic: Sound ${filePath} is now active.`);
    source.onended = () => {
      console.log(`[AudioManager] internalPlayLogic: Sound ended naturally or was stopped: ${filePath}`);
      const currentSound = activeSounds.get(filePath);
      if (currentSound && currentSound.source === source) {
        activeSounds.delete(filePath);
        console.log(`[AudioManager] playSound: Sound ${filePath} removed from active sounds after ending.`);
      }
    };
    return source;
  } catch (error) {
    console.error(`[AudioManager] internalPlayLogic Error for ${filePath}:`, error);
    return null;
  }
}
playSoundInternal = internalPlayLogic;

async function playSound(request: PlaySoundRequest): Promise<AudioBufferSourceNode | null> {
  console.log(`[AudioManager] playSound (exposed): Called for: ${request.filePath}`, request);
  const context = await getAudioContext();
  if (context && context.state === 'running') {
    console.log(`[AudioManager] playSound (exposed): Context is running for ${request.filePath}. Playing directly via internalPlayLogic.`);
    return playSoundInternal ? playSoundInternal(request) : null;
  } else if (context && context.state === 'suspended' && !isContextResumedByGesture) {
    console.log(`[AudioManager] playSound (exposed): Context is suspended for ${request.filePath}. Queuing request.`);
    pendingPlayRequests.push({ ...request, timestamp: Date.now() });
    return null;
  } else if (context && context.state === 'suspended' && isContextResumedByGesture) {
    console.log(`[AudioManager] playSound (exposed): Context is suspended but gesture was registered for ${request.filePath}. Queuing and attempting to process queue.`);
    pendingPlayRequests.push({ ...request, timestamp: Date.now() });
    processPendingPlayRequests();
    return null;
  } else {
    console.error(`[AudioManager] playSound (exposed): Context not available or in a bad state for ${request.filePath} (State: ${context?.state}). Cannot play or queue.`);
    return null;
  }
}

function stopSound(filePath: string, fadeOutDuration = 0) {
  console.log(`[AudioManager] stopSound: Called for: ${filePath}, fade: ${fadeOutDuration}`);
  const sound = activeSounds.get(filePath);
  const context = audioContext;
  if (sound && sound.isPlaying && context && context.state === 'running') {
    console.log(`[AudioManager] stopSound: Stopping active sound: ${filePath}`);
    sound.isPlaying = false;
    const stopTime = context.currentTime + fadeOutDuration;
    if (fadeOutDuration > 0) {
      console.log(`[AudioManager] stopSound: Applying fade-out for ${filePath} over ${fadeOutDuration}s`);
      try {
        const currentVolume = sound.gainNode.gain.value;
        sound.gainNode.gain.setValueAtTime(currentVolume, context.currentTime);
        sound.gainNode.gain.linearRampToValueAtTime(0.0001, stopTime);
        sound.source.stop(stopTime);
        console.log(`[AudioManager] stopSound: Scheduled stop for ${filePath} at ${stopTime}`);
      } catch (e) {
        console.error(`[AudioManager] stopSound: Error during fadeOut for ${filePath}:`, e);
        try { sound.source.stop(); } catch (err) { /* ignore */ }
      }
    } else {
      try {
        sound.source.stop();
        console.log(`[AudioManager] stopSound: Sound ${filePath} stopped immediately.`);
      } catch (e) {}
    }
  } else {
    if (!sound) console.log(`[AudioManager] stopSound: Sound ${filePath} not found in active sounds.`);
    else if (sound && !sound.isPlaying) console.log(`[AudioManager] stopSound: Sound ${filePath} is already marked as not playing.`);
    else if (!context || context.state !== 'running') console.log(`[AudioManager] stopSound: AudioContext not available or not running for ${filePath}. State: ${context?.state}`);
  }
}

function stopAllSounds(fadeOutDuration = 0) {
  console.log(`[AudioManager] stopAllSounds: Called with fade: ${fadeOutDuration}`);
  activeSounds.forEach((_sound, filePath) => {
    stopSound(filePath, fadeOutDuration);
  });
}

function manualResumeAudioContext() {
  console.log('[AudioManager] manualResumeAudioContext called.');
  tryResumeAudioContext();
}

export default {
  playSound,
  stopSound,
  stopAllSounds,
  loadSound,
  manualResumeAudioContext,
  get audioContext() { return audioContext; }
}; 
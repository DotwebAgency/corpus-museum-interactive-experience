/**
 * DIGITALE IDENTITÄT SCHWEIZ — MediaPipe Tracker
 * Schweizerische Eidgenossenschaft
 * 
 * Full body pose tracking using MediaPipe Pose Landmarker
 */

import { 
  FilesetResolver, 
  PoseLandmarker,
  FaceLandmarker,
  HandLandmarker,
  GestureRecognizer 
} from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/+esm';

export class MediaPipeTracker {
  constructor() {
    this.poseLandmarker = null;
    this.faceLandmarker = null;
    this.handLandmarker = null;
    this.gestureRecognizer = null; // NEW: For native gesture detection
    this.video = null;
    this.onResults = null;
    this.isProcessing = false;
    this.lastVideoTime = -1;
    this.animationId = null;
    
    this.debug = true;
    this.useGestureRecognizer = true; // Toggle native gesture detection
  }
  
  log(message) {
    if (this.debug) {
      console.log(`[MediaPipeTracker] ${message}`);
    }
  }
  
  async initialize(videoElement, onResults, onProgress) {
    this.video = videoElement;
    this.onResults = onResults;
    
    this.log('Starting initialization...');
    
    try {
      onProgress?.(0.1, 'Lade MediaPipe Module...');
      
      const filesetResolver = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm'
      );
      this.log('FilesetResolver ready');
      
      // Initialize Pose Landmarker (full body - 33 landmarks)
      onProgress?.(0.3, 'Lade Körpererkennung...');
      
      // PERFORMANCE: Use lite model for much faster inference (vs heavy)
      this.poseLandmarker = await PoseLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
          delegate: 'GPU'
        },
        runningMode: 'VIDEO',
        numPoses: 1,
        minPoseDetectionConfidence: 0.4, // Slightly lower for faster response
        minPosePresenceConfidence: 0.4,
        minTrackingConfidence: 0.4
      });
      this.log('PoseLandmarker initialized (lite model for better performance)');
      
      // Initialize Face Landmarker for detailed face mesh
      onProgress?.(0.5, 'Lade Gesichtserkennung...');
      
      this.faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
          delegate: 'GPU'
        },
        runningMode: 'VIDEO',
        numFaces: 1,
        outputFaceBlendshapes: true, // ENABLED: Expression detection (52 blendshapes)
        outputFacialTransformationMatrixes: false
      });
      this.log('FaceLandmarker initialized (468 face landmarks + 52 blendshapes)');
      
      // Initialize Gesture Recognizer (includes hand landmarks + gesture detection)
      onProgress?.(0.7, 'Lade Gestenerkennung...');
      
      // PERFORMANCE: Optimized confidence values for faster response while maintaining stability
      if (this.useGestureRecognizer) {
        this.gestureRecognizer = await GestureRecognizer.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task',
            delegate: 'GPU'
          },
          runningMode: 'VIDEO',
          numHands: 2,
          // BALANCED: Lower thresholds for faster detection response
          minHandDetectionConfidence: 0.5,
          minHandPresenceConfidence: 0.5,
          minTrackingConfidence: 0.5
        });
        this.log('GestureRecognizer initialized (FAST MODE - balanced confidence)');
      } else {
        // Fallback to HandLandmarker only
        this.handLandmarker = await HandLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'GPU'
          },
          runningMode: 'VIDEO',
          numHands: 2,
          // BALANCED: Lower thresholds for faster detection response
          minHandDetectionConfidence: 0.5,
          minHandPresenceConfidence: 0.5,
          minTrackingConfidence: 0.5
        });
        this.log('HandLandmarker initialized (FAST MODE)');
      }
      
      // Start camera
      onProgress?.(0.85, 'Aktiviere Kamera...');
      await this.startCamera();
      
      onProgress?.(1.0, 'Bereit');
      this.log('Initialization complete');
      
      // Start processing
      this.startProcessing();
      
    } catch (error) {
      console.error('[MediaPipeTracker] Initialization failed:', error);
      throw error;
    }
  }
  
  async startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });
      
      this.video.srcObject = stream;
      
      return new Promise((resolve, reject) => {
        this.video.onloadedmetadata = () => {
          this.video.play()
            .then(() => {
              this.log(`Camera started: ${this.video.videoWidth}x${this.video.videoHeight}`);
              resolve();
            })
            .catch(reject);
        };
        this.video.onerror = reject;
      });
      
    } catch (error) {
      console.error('[MediaPipeTracker] Camera access failed:', error);
      throw new Error('Kamerazugriff verweigert. Bitte erlauben Sie den Kamerazugriff.');
    }
  }
  
  startProcessing() {
    this.log('Starting detection loop');
    this.processFrame();
  }
  
  processFrame() {
    if (!this.video || this.video.paused || this.video.ended) {
      this.animationId = requestAnimationFrame(() => this.processFrame());
      return;
    }
    
    const currentTime = this.video.currentTime;
    
    if (currentTime !== this.lastVideoTime && !this.isProcessing) {
      this.lastVideoTime = currentTime;
      this.isProcessing = true;
      
      const timestamp = performance.now();
      
      try {
        // Run pose detection (full body)
        let poseResults = null;
        if (this.poseLandmarker) {
          poseResults = this.poseLandmarker.detectForVideo(this.video, timestamp);
        }
        
        // Run face detection (detailed mesh)
        let faceResults = null;
        if (this.faceLandmarker) {
          faceResults = this.faceLandmarker.detectForVideo(this.video, timestamp);
        }
        
        // Run gesture/hand detection
        let handResults = null;
        let gestureResults = null;
        
        if (this.gestureRecognizer) {
          gestureResults = this.gestureRecognizer.recognizeForVideo(this.video, timestamp);
          // GestureRecognizer also provides hand landmarks
          handResults = {
            landmarks: gestureResults?.landmarks || [],
            handedness: gestureResults?.handedness || []
          };
        } else if (this.handLandmarker) {
          handResults = this.handLandmarker.detectForVideo(this.video, timestamp);
        }
        
        // Combine all results
        const combinedResults = {
          // Full body pose (33 landmarks)
          poseLandmarks: poseResults?.landmarks || [],
          worldLandmarks: poseResults?.worldLandmarks || [],
          
          // Detailed face (468 landmarks)
          faceLandmarks: faceResults?.faceLandmarks || [],
          
          // NEW: Face blendshapes for expression detection (52 coefficients)
          faceBlendshapes: faceResults?.faceBlendshapes || [],
          
          // Detailed hands (21 landmarks each)
          handLandmarks: handResults?.landmarks || [],
          handedness: handResults?.handedness || [],
          
          // NEW: Native gesture recognition
          gestures: gestureResults?.gestures || []
        };
        
        if (this.onResults) {
          this.onResults(combinedResults);
        }
        
      } catch (error) {
        console.error('[MediaPipeTracker] Frame processing error:', error);
      }
      
      this.isProcessing = false;
    }
    
    this.animationId = requestAnimationFrame(() => this.processFrame());
  }
  
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    if (this.video && this.video.srcObject) {
      const tracks = this.video.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      this.video.srcObject = null;
    }
    
    this.log('Tracker stopped');
  }
  
  destroy() {
    this.stop();
    
    if (this.poseLandmarker) {
      this.poseLandmarker.close();
      this.poseLandmarker = null;
    }
    
    if (this.faceLandmarker) {
      this.faceLandmarker.close();
      this.faceLandmarker = null;
    }
    
    if (this.handLandmarker) {
      this.handLandmarker.close();
      this.handLandmarker = null;
    }
    
    if (this.gestureRecognizer) {
      this.gestureRecognizer.close();
      this.gestureRecognizer = null;
    }
    
    this.log('Tracker destroyed');
  }
}

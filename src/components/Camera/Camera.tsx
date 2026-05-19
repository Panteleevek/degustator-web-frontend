import { useRef, useState } from 'react';
import Webcam from 'react-webcam';

interface CameraProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

 const Camera = ({ onCapture, onClose }: CameraProps) => {
  const webcamRef = useRef<Webcam>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50">
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode }}
        className="w-full h-full object-cover"
      />
      
      <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center gap-4">
        <button
          onClick={() => setFacingMode(facingMode === 'user' ? 'environment' : 'user')}
          className="bg-white/20 backdrop-blur-lg p-4 rounded-full"
        >
          🔄
        </button>
        <button
          onClick={capture}
          className="bg-white p-6 rounded-full border-4 border-gray-300"
        />
        <button
          onClick={onClose}
          className="bg-red-500 px-6 py-3 rounded-lg text-white"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}

export default Camera
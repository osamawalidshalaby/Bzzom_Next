"use client";
import { useCallback } from "react";

export const useCartSound = () => {
  const playAddToCartSound = useCallback(() => {
    if (typeof window === "undefined") return;

    try {
      // محاولة استخدام Web Audio API
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContext();

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.1
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.log("تعذر تشغيل الصوت");
    }
  }, []);

  return { playAddToCartSound };
};

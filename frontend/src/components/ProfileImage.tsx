'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export function ProfileImage() {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!focused) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFocused(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [focused]);

  const size = 120;
  const focusSize = 280;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.02 }}
        style={{ position: 'relative', cursor: 'pointer' }}
        onClick={() => setFocused(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <motion.div
          animate={hovered ? { scale: 1.08 } : { scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-3))',
          }}
        >
          {imgError ? (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-6))',
                color: 'light-dark(var(--mantine-color-gray-5), var(--mantine-color-dark-2))',
                fontSize: 40,
                fontWeight: 700,
              }}
            >
              ?
            </div>
          ) : (
            <Image
              src="/images/profile.jpg"
              alt="Thalvindo"
              width={size * 2}
              height={size * 2}
              priority
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              onError={() => setImgError(true)}
            />
          )}
        </motion.div>

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                inset: -6,
                borderRadius: '50%',
                border: '1.5px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-2))',
                pointerEvents: 'none',
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {focused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              cursor: 'pointer',
            }}
            onClick={() => setFocused(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {imgError ? (
                <div
                  style={{
                    width: focusSize,
                    height: focusSize,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-6))',
                    color: 'light-dark(var(--mantine-color-gray-5), var(--mantine-color-dark-2))',
                    fontSize: 80,
                    fontWeight: 700,
                    border: '2px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-2))',
                  }}
                >
                  ?
                </div>
              ) : (
                <Image
                  src="/images/profile.jpg"
                  alt="Thalvindo"
                  width={focusSize}
                  height={focusSize}
                  style={{
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-2))',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                  }}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

'use client';

import { motion } from 'framer-motion';

/**
 * Scroll-reveal sarmalayıcı: içerik görünür alana girince
 * yumuşakça belirip yukarı kayar. delay ile sıralı giriş yapılır.
 */
export default function Reveal({
    children,
    delay = 0,
    y = 28,
    className,
}: {
    children: React.ReactNode;
    delay?: number;
    y?: number;
    className?: string;
}) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
            {children}
        </motion.div>
    );
}

'use client'

import React, { useEffect, useRef, useState } from 'react'

interface ScrollRevealProps {
    children: React.ReactNode
    animation?: 'fade-up' | 'fade-in' | 'slide-in-left' | 'slide-in-right' | 'zoom-in'
    delay?: number
    duration?: number
    className?: string
    threshold?: number
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
    children,
    animation = 'fade-up',
    delay = 0,
    duration = 0.6,
    className = '',
    threshold = 0.1
}) => {
    const [isVisible, setIsVisible] = useState(false)
    const domRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.unobserve(entry.target)
                }
            })
        }, { threshold })

        const currentRef = domRef.current
        if (currentRef) observer.observe(currentRef)

        return () => {
            if (currentRef) observer.unobserve(currentRef)
        }
    }, [threshold])

    const getAnimationClass = () => {
        switch (animation) {
            case 'fade-up': return 'animate-fade-up'
            case 'fade-in': return 'animate-fade-in'
            case 'slide-in-left': return 'animate-slide-in-left'
            case 'slide-in-right': return 'animate-slide-in-right'
            case 'zoom-in': return 'animate-zoom-in'
            default: return 'animate-fade-up'
        }
    }

    return (
        <div
            ref={domRef}
            className={`scroll-reveal ${isVisible ? 'is-visible' : ''} ${getAnimationClass()} ${className}`}
            style={{
                transitionDuration: `${duration}s`,
                transitionDelay: `${delay}s`
            }}
        >
            {children}
        </div>
    )
}

export default ScrollReveal

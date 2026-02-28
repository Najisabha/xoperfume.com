'use client';

import Image from 'next/image';

export interface CustomTextProps {
    text: string;
    size?: number;
    color?: string;
    letterSpacing?: number;
    className?: string;
    style?: React.CSSProperties;
}

const CustomText = ({
    text,
    size = 24,
    color = 'black',
    className,
    style,
}: CustomTextProps) => {
    const getLetterPath = (char: string) => {
        const isUpperCase = char === char.toUpperCase();
        const folder = isUpperCase ? 'capital' : 'small';
        const letterIndex = char.toLowerCase().charCodeAt(0) - 96;

        if (letterIndex < 1 || letterIndex > 25) return null;
        return `/assets/letters/${folder}/${letterIndex}.svg`;
    };

    return (
        <div
            className={className}
            style={{
                display: 'flex',
                alignItems: 'center',
                // gap: `${letterSpacing}px`,
                ...style,
            }}
        >
            {text.split('').map((char, index) => {
                if (char === ' ') {
                    return <span key={index} style={{ width: size }} />;
                }

                const letterPath = getLetterPath(char);
                if (!letterPath) return null;

                return (
                    <div
                        key={index}
                        style={{
                            width: size,
                            height: size,
                            position: 'relative',
                            marginInline: -3
                        }}
                    >
                        <img
                            src={letterPath}
                            alt={char}
                            style={{
                                filter: 'invert(1) sepia(1) saturate(1) hue-rotate(65deg)',
                            }}
                            sizes={`${size}px`}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default CustomText;
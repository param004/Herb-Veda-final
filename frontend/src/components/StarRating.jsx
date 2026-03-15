import { useState } from 'react';
import { FiStar } from 'react-icons/fi';

const StarRating = ({ value = 0, onChange, size = 'md', readonly = false }) => {
    const [hovered, setHovered] = useState(0);
    const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-7 h-7' };

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
                const filled = (hovered || value) >= star;
                return (
                    <button
                        key={star}
                        type="button"
                        onClick={() => !readonly && onChange?.(star)}
                        onMouseEnter={() => !readonly && setHovered(star)}
                        onMouseLeave={() => !readonly && setHovered(0)}
                        className={`transition-transform duration-100 ${!readonly ? 'hover:scale-125 cursor-pointer' : 'cursor-default'}`}
                    >
                        <FiStar
                            className={`${sizes[size]} transition-colors ${filled ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                                }`}
                        />
                    </button>
                );
            })}
        </div>
    );
};

export default StarRating;

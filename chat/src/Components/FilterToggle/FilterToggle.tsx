import { FC } from "react";
import { DisableFilterIcon } from "../../assets/Icons/DisableFilter";
import { EnableFilterIcon } from "../../assets/Icons/EnableFilter";

export const FilterToggle: FC<{
    className?: string;
    filter: string;
    onToggle: () => void;
}> = ({ className, onToggle, filter }) => {
    return (
        <span
            className={className}
            onClick={(e) => {
                e.stopPropagation();
                onToggle();
            }}
        >
            {filter ? (
                <DisableFilterIcon className="w-8" />
            ) : (
                <EnableFilterIcon className="w-8" />
            )}
        </span>
    );
};

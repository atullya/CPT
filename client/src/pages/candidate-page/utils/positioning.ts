export interface Dimensions {
    width: number;
    height: number;
}

export interface Point {
    top: number;
    left: number;
}

export interface Rect {
    top: number;
    bottom: number;
    left: number;
    right: number;
    width: number;
    height: number;
}

/**
 * Calculates the position for a menu to ensure it fits within the viewport.
 * 
 * @param triggerRect The bounding rectangle of the trigger element.
 * @param menuDimensions The estimated dimensions of the menu.
 * @param viewport The current viewport dimensions (width and height).
 * @param type 'dropdown' (aligns with button) or 'submenu' (pops out to side)
 * @returns The { top, left } coordinates for the menu.
 */
export const calculateMenuPosition = (
    triggerRect: Rect,
    menuDimensions: Dimensions,
    viewport: Dimensions,
    type: 'dropdown' | 'submenu' = 'dropdown'
): Point => {
    const PADDING = 16; // Buffer from screen edge
    const { width: viewportWidth, height: viewportHeight } = viewport;
    const { width: menuWidth, height: menuHeight } = menuDimensions;

    let left = 0;
    let top = 0;

    // HORIZONTAL POSITIONING
    if (type === 'dropdown') {
        // Default: Align Left edge of menu with Left edge of trigger (opens right)
        // OR: Align Left edge of menu with Right edge of trigger (if specific style)
        // Based on existing code: `left: rect.right` -> Originally opened to the right of the button?
        // Let's assume standard behavior:
        // Try to place to the right of the trigger (rect.right)
        // If overflow, align right edge of menu with right edge of trigger (rect.right - menuWidth)
        // Wait, existing code `left: rect.right` means it starts at the right of the button.

        let proposedLeft = triggerRect.right;

        // Check if it fits on the right
        if (proposedLeft + menuWidth + PADDING <= viewportWidth) {
            left = proposedLeft;
        } else {
            // Determine best fallback.
            // Option A: Flip to Left of trigger (starts at rect.left - menuWidth)
            // Option B: Align Right edges (starts at rect.right - menuWidth)

            // If we are strictly checking "enough space", let's check Left.
            const spaceLeft = triggerRect.left;

            if (spaceLeft >= menuWidth + PADDING) {
                left = triggerRect.left - menuWidth;
            } else {
                // If neither fits perfectly, pick the side with MORE space or force Align Right Edge
                // Usually aligning right edge to trigger right edge is safe for a 3-dot menu
                left = triggerRect.right - menuWidth;
            }
        }

    } else { // 'submenu'
        // Default: Open to the Right of the trigger
        let proposedLeft = triggerRect.right;

        if (proposedLeft + menuWidth + PADDING <= viewportWidth) {
            left = proposedLeft;
        } else {
            // Flip to Left of the trigger
            left = triggerRect.left - menuWidth;
        }
    }

    // Safety clamp for Left (don't go off screen left)
    left = Math.max(PADDING, left);
    // Safety clamp for Right (don't go off screen right) - logic above usually handles this, but ensures hard limit
    // If left + width > viewportWidth, shift it back
    if (left + menuWidth > viewportWidth - PADDING) {
        left = viewportWidth - menuWidth - PADDING;
    }


    // VERTICAL POSITIONING
    // Default: Open Top aligned with Trigger Top (for submenu) or Bottom of Trigger (for dropdown)
    if (type === 'dropdown') {
        top = triggerRect.bottom + 4; // slight gap
    } else {
        top = triggerRect.top;
    }

    // Check bottom overflow
    if (top + menuHeight + PADDING > viewportHeight) {
        // Flip Up
        // For dropdown: Top is Trigger Top - Menu Height - gap
        // For submenu: Bottom aligned with Trigger Bottom? Or just shift up?

        if (type === 'dropdown') {
            top = triggerRect.top - menuHeight - 4;
        } else {
            // Shift up so bottom aligns with viewport bottom (minus padding)
            top = viewportHeight - menuHeight - PADDING;
        }
    }

    // Safety clamp Top
    top = Math.max(PADDING, top);

    return { top, left };
};

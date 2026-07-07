
// ============================================
// WYSIWYG ENHANCEMENTS: RTF TOOLBAR
// Robust implementation for iframe editing
// ============================================

window.addEventListener('DOMContentLoaded', () => {
    const toolbar = document.getElementById('rtf-toolbar');
    if (!toolbar) return;

    // Helper to get the active iframe document
    const getDoc = () => window.getCanvasDoc ? window.getCanvasDoc() : null;

    // 1. Prevent toolbar from stealing focus generally
    toolbar.addEventListener('mousedown', (e) => {
        // We must allow interaction with inputs (color picker), 
        // but prevent focus theft for buttons so the cursor stays in the iframe
        if (e.target.tagName !== 'INPUT') {
            e.preventDefault();
        }
    });

    // 2. Handle Button Clicks
    toolbar.addEventListener('click', (e) => {
        const btn = e.target.closest('.rtf-btn');
        if (!btn) return;

        const command = btn.dataset.rtf;
        const doc = getDoc();
        if (!doc) return;

        // Ensure we are operating on the iframe document
        // We use execCommand for basic styling (bold, italic, etc)
        // This is deprecated but still the only reliable way for contentEditable
        
        if (command === 'createLink') {
            const url = prompt('Enter link URL:', 'https://');
            if (url) doc.execCommand(command, false, url);
        } else if (command === 'link') {
            const url = prompt('Enter link URL:', 'https://');
            if (url) doc.execCommand('createLink', false, url);
        } else if (command === 'clearFormat') {
            doc.execCommand('removeFormat', false, null);
            doc.execCommand('unlink', false, null);
        } else {
            // Toggle boolean commands (bold, italic, etc)
            doc.execCommand(command, false, null);
        }
        
        // Refresh active button states
        updateToolbarStates(doc);
    });

    // 3. Handle Color Picker
    const colorPicker = document.getElementById('rtf-text-color');
    if (colorPicker) {
        colorPicker.addEventListener('input', (e) => {
            const doc = getDoc();
            if (doc) doc.execCommand('foreColor', false, e.target.value);
        });
    }
    
    // 4. Update Toolbar UI based on selection
    function updateToolbarStates(doc) {
        if(!doc) return;
        try {
            document.querySelectorAll('.rtf-btn').forEach(btn => {
                const cmd = btn.dataset.rtf;
                if (doc.queryCommandState(cmd)) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        } catch(e) {
            // Ignore errors if selection is invalid
        }
    }

    // Monitor selection changes in the iframe to update toolbar
    // We poll or attach listener if possible. 
    // Since we can't easily attach to the dynamic iframe here, 
    // we rely on the click handler in the iframe (in index.html) to trigger updates if needed.
});

const imageList = [
    { id: 'Art & Creative Expression', src: 'images/art&creativeexpression.jpg', alt: 'Art and Creative Expression' },
    { id: 'Career', src: 'images/career.jpg', alt: 'Laptops in an office' },
    { id: 'Childen/Children', src: 'images/parent&child.jpg', alt: 'Photo of parent holding their child' },
    { id: 'Education', src: 'images/Education.jpg', alt: 'Grad hats being thrown into the air' },
    { id: 'Family', src: 'images/Family.jpg', alt: 'Photo of a family of 6' },
    { id: 'Friends', src: 'images/Friends.jpg', alt: 'A photo of a group of friends' },
    { id: 'Health', src: 'images/Health.jpg', alt: 'A photo of rocks balancing resembling health' },
    { id: 'Hobbies', src: 'images/Hobbies.jpeg', alt: 'A photo of a game controller resembling hobbies' },
    { id: 'House', src: 'images/House.jpg', alt: 'House' },
    { id: 'Partnership & Love', src: 'images/Partnership&Love.jpg', alt: '2 people making a heart shape with hands' },
    { id: 'Pets', src: 'images/Pets.jpg', alt: 'Cat and dog photo' },
    { id: 'Vacation & Travel', src: 'images/Vacation&Travel.jpg', alt: 'Looking out of an airplane in the sky' },
];

const imageContainer = document.getElementById('image-container');
const matrixContainer = document.getElementById('matrix-container');
let activeImage = null;

// Create draggable images

imageList.forEach(image => {
    const div = document.createElement('div');
    div.className = 'draggable';
    div.draggable = true;
    div.id = image.id;
    div.innerHTML = `
        <img src="${image.src}" alt="${image.alt}">
        <span class="image-label">${image.id}</span>
    `;
    imageContainer.appendChild(div);
    
    div.addEventListener('mousedown', dragStart);
});

document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', dragEnd);

function dragStart(e) {
    if (e.target.closest('.draggable')) {
        activeImage = e.target.closest('.draggable');
        const rect = activeImage.getBoundingClientRect();
        
        // Calculate offset
        activeImage.offsetX = e.clientX - rect.left;
        activeImage.offsetY = e.clientY - rect.top;
        
        // Prepare for moving and enlarge
        activeImage.style.zIndex = 1000;
        activeImage.classList.add('enlarged');
    }
}

function drag(e) {
    if (activeImage) {
        const matrixRect = matrixContainer.getBoundingClientRect();
        if (e.clientX > matrixRect.left && e.clientY > matrixRect.top &&
            e.clientX < matrixRect.right && e.clientY < matrixRect.bottom) {
            // Over the matrix
            if (!activeImage.classList.contains('on-matrix')) {
                activeImage.classList.add('on-matrix');
                matrixContainer.appendChild(activeImage);
            }
            positionImageInMatrix(e);
        } else {
            // Not over the matrix
            activeImage.style.transform = `translate(${e.clientX - activeImage.offsetX}px, ${e.clientY - activeImage.offsetY}px)`;
        }
    }
}

function dragEnd(e) {
    if (activeImage) {
        const matrixRect = matrixContainer.getBoundingClientRect();
        if (e.clientX <= matrixRect.left || e.clientY <= matrixRect.top ||
            e.clientX >= matrixRect.right || e.clientY >= matrixRect.bottom) {
            // Outside the matrix, return to image list
            activeImage.classList.remove('on-matrix');
            activeImage.style.position = '';
            activeImage.style.left = '';
            activeImage.style.top = '';
            activeImage.style.transform = '';
            imageContainer.appendChild(activeImage);
        }
        activeImage.style.zIndex = '';
        activeImage.classList.remove('enlarged');
        activeImage = null;
    }
}

function positionImageInMatrix(e) {
    const matrixRect = matrixContainer.getBoundingClientRect();
    let x = e.clientX - matrixRect.left - activeImage.offsetX;
    let y = e.clientY - matrixRect.top - activeImage.offsetY;
    
    // Constrain within matrix
    x = Math.max(0, Math.min(x, matrixRect.width - activeImage.offsetWidth));
    y = Math.max(0, Math.min(y, matrixRect.height - activeImage.offsetHeight));
    
    activeImage.style.position = 'absolute';
    activeImage.style.left = `${x}px`;
    activeImage.style.top = `${y}px`;
    activeImage.style.transform = '';
}
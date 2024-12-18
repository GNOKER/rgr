const arrayContainer = document.getElementById('array-container') as HTMLElement;
const startButton = document.getElementById('start-button') as HTMLButtonElement;
const sortMethodSelect = document.getElementById('sort-method') as HTMLSelectElement;

function generateRandomArray(size: number): number[] {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
}

function renderArray(array: number[]) {
    arrayContainer.innerHTML = '';
    
    array.forEach(value => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${value * 3}px`; // Умножаем на 2 для масштабирования
        arrayContainer.appendChild(bar);
    });

    // Проверка переполнения и настройка прокрутки
    const containerWidth = array.length * 7; // Ширина столбцов и отступов
    const visibleWidth = arrayContainer.parentElement?.clientWidth || 0;

    if (containerWidth > visibleWidth) {
        arrayContainer.style.width = `${containerWidth}px`; // Устанавливаем ширину для прокрутки
    } else {
        arrayContainer.style.width = '100%'; // Иначе заполняем видимую ширину
    }
}




async function bubbleSort(array: number[]) {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            renderArray(array);
            await new Promise(resolve => setTimeout(resolve, 0));

            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
            }
        }
    }
}

async function combSort(array: number[]) {
    let gap = array.length;
    const shrink = 1.3;
    let sorted = false;

    while (gap > 1 || !sorted) {
        gap = Math.floor(gap / shrink);
        if (gap < 1) gap = 1;
        sorted = true;

        for (let i = 0; i < array.length - gap; i++) {
            renderArray(array);
            await new Promise(resolve => setTimeout(resolve, 0));

            if (array[i] > array[i + gap]) {
                [array[i], array[i + gap]] = [array[i + gap], array[i]];
                sorted = false;
            }
        }
    }
}

async function quickSort(array: number[], left: number = 0, right: number = array.length - 1) {
    if (left < right) {
        const pivotIndex = await partition(array, left, right);
        await quickSort(array, left, pivotIndex - 1);
        await quickSort(array, pivotIndex + 1, right);
    }
}

async function partition(array: number[], left: number, right: number): Promise<number> {
    const pivotValue = array[right];
    let pivotIndex = left;

    for (let i = left; i < right; i++) {
        renderArray(array);
        await new Promise(resolve => setTimeout(resolve, 0));

        if (array[i] < pivotValue) {
            [array[i], array[pivotIndex]] = [array[pivotIndex], array[i]];
            pivotIndex++;
        }
    }

    [array[pivotIndex], array[right]] = [array[right], array[pivotIndex]];
    return pivotIndex;
}

async function heapSort(array: number[]) {
    const n = array.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(array, n, i);
        renderArray(array);
    }

    for (let i = n - 1; i > 0; i--) {
        [array[0], array[i]] = [array[i], array[0]];
        renderArray(array);
        await new Promise(resolve => setTimeout(resolve, 0));

        await heapify(array, i, 0);
    }
}

async function heapify(array: number[], n: number, i: number) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && array[left] > array[largest]) largest = left;
    if (right < n && array[right] > array[largest]) largest = right;

    if (largest !== i) {
        [array[i], array[largest]] = [array[largest], array[i]];
        renderArray(array);
        await new Promise(resolve => setTimeout(resolve, 10));

        await heapify(array, n, largest);
    }
}

async function shakerSort(array: number[]) {
    let left = 0;
    let right = array.length - 1;
    let swapped;

    do {
        swapped = false;

        for (let i = left; i < right; i++) {
            renderArray(array);
            await new Promise(resolve => setTimeout(resolve, 0));

            if (array[i] > array[i + 1]) {
                [array[i], array[i + 1]] = [array[i + 1], array[i]];
                swapped = true;
            }
        }
        right--;

        for (let i = right; i > left; i--) {
            renderArray(array);
            await new Promise(resolve => setTimeout(resolve, 0));

            if (array[i] < array[i - 1]) {
                [array[i], array[i - 1]] = [array[i - 1], array[i]];
                swapped = true;
            }
        }
        left++;
    } while (swapped);
}

async function sortAndMeasureTime(sortFunction: (array: number[]) => Promise<void>, size: number) {
    const randomArray = generateRandomArray(size);
    renderArray(randomArray);

    const startTime = performance.now();
    await sortFunction(randomArray);
    const endTime = performance.now();

    const duration = endTime - startTime;
    return duration >= 1000
        ? `${(duration / 1000).toFixed(2)} сек`
        : `${duration.toFixed(2)} мс`;
}

let currentSizeIndex = 0;
const sizes = [500, 1000, 1500];
startButton.addEventListener('click', async () => {
    const selectedMethod = sortMethodSelect.value as keyof typeof sortMethods;

    if (currentSizeIndex < sizes.length) {
        startButton.disabled = true;
        const size = sizes[currentSizeIndex];
        const timeString = await sortAndMeasureTime(sortMethods[selectedMethod], size);

        alert(`Массив из ${size} элементов отсортирован за ${timeString}.`);
        currentSizeIndex++;
        if (currentSizeIndex >= sizes.length) {
            currentSizeIndex = 0;
        }
        startButton.disabled = false;
    }
});

const sortMethods: { [key: string]: (array: number[]) => Promise<void> } = {
    bubbleSort,
    combSort,
    quickSort,
    heapSort,
    shakerSort
};

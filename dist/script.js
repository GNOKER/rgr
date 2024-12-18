"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const arrayContainer = document.getElementById('array-container');
const startButton = document.getElementById('start-button');
const sortMethodSelect = document.getElementById('sort-method');
function generateRandomArray(size) {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
}
function renderArray(array) {
    var _a;
    arrayContainer.innerHTML = '';
    array.forEach(value => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${value * 3}px`;
        arrayContainer.appendChild(bar);
    });
    const containerWidth = array.length * 7;
    const visibleWidth = ((_a = arrayContainer.parentElement) === null || _a === void 0 ? void 0 : _a.clientWidth) || 0;
    if (containerWidth > visibleWidth) {
        arrayContainer.style.width = `${containerWidth}px`;
    }
    else {
        arrayContainer.style.width = '100%';
    }
}
function bubbleSort(array) {
    return __awaiter(this, void 0, void 0, function* () {
        const n = array.length;
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                renderArray(array);
                yield new Promise(resolve => setTimeout(resolve, 0));
                if (array[j] > array[j + 1]) {
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
                }
            }
        }
    });
}
function combSort(array) {
    return __awaiter(this, void 0, void 0, function* () {
        let gap = array.length;
        const shrink = 1.3;
        let sorted = false;
        while (gap > 1 || !sorted) {
            gap = Math.floor(gap / shrink);
            if (gap < 1)
                gap = 1;
            sorted = true;
            for (let i = 0; i < array.length - gap; i++) {
                renderArray(array);
                yield new Promise(resolve => setTimeout(resolve, 0));
                if (array[i] > array[i + gap]) {
                    [array[i], array[i + gap]] = [array[i + gap], array[i]];
                    sorted = false;
                }
            }
        }
    });
}
function quickSort(array_1) {
    return __awaiter(this, arguments, void 0, function* (array, left = 0, right = array.length - 1) {
        if (left < right) {
            const pivotIndex = yield partition(array, left, right);
            yield quickSort(array, left, pivotIndex - 1);
            yield quickSort(array, pivotIndex + 1, right);
        }
    });
}
function partition(array, left, right) {
    return __awaiter(this, void 0, void 0, function* () {
        const pivotValue = array[right];
        let pivotIndex = left;
        for (let i = left; i < right; i++) {
            renderArray(array);
            yield new Promise(resolve => setTimeout(resolve, 0));
            if (array[i] < pivotValue) {
                [array[i], array[pivotIndex]] = [array[pivotIndex], array[i]];
                pivotIndex++;
            }
        }
        [array[pivotIndex], array[right]] = [array[right], array[pivotIndex]];
        return pivotIndex;
    });
}
function heapSort(array) {
    return __awaiter(this, void 0, void 0, function* () {
        const n = array.length;
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            yield heapify(array, n, i);
            renderArray(array);
        }
        for (let i = n - 1; i > 0; i--) {
            [array[0], array[i]] = [array[i], array[0]];
            renderArray(array);
            yield new Promise(resolve => setTimeout(resolve, 0));
            yield heapify(array, i, 0);
        }
    });
}
function heapify(array, n, i) {
    return __awaiter(this, void 0, void 0, function* () {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        if (left < n && array[left] > array[largest])
            largest = left;
        if (right < n && array[right] > array[largest])
            largest = right;
        if (largest !== i) {
            [array[i], array[largest]] = [array[largest], array[i]];
            renderArray(array);
            yield new Promise(resolve => setTimeout(resolve, 10));
            yield heapify(array, n, largest);
        }
    });
}
function shakerSort(array) {
    return __awaiter(this, void 0, void 0, function* () {
        let left = 0;
        let right = array.length - 1;
        let swapped;
        do {
            swapped = false;
            for (let i = left; i < right; i++) {
                renderArray(array);
                yield new Promise(resolve => setTimeout(resolve, 0));
                if (array[i] > array[i + 1]) {
                    [array[i], array[i + 1]] = [array[i + 1], array[i]];
                    swapped = true;
                }
            }
            right--;
            for (let i = right; i > left; i--) {
                renderArray(array);
                yield new Promise(resolve => setTimeout(resolve, 0));
                if (array[i] < array[i - 1]) {
                    [array[i], array[i - 1]] = [array[i - 1], array[i]];
                    swapped = true;
                }
            }
            left++;
        } while (swapped);
    });
}
function sortAndMeasureTime(sortFunction, size) {
    return __awaiter(this, void 0, void 0, function* () {
        const randomArray = generateRandomArray(size);
        renderArray(randomArray);
        const startTime = performance.now();
        yield sortFunction(randomArray);
        const endTime = performance.now();
        const duration = endTime - startTime;
        return duration >= 1000
            ? `${(duration / 1000).toFixed(2)} сек`
            : `${duration.toFixed(2)} мс`;
    });
}
let currentSizeIndex = 0;
const sizes = [500, 1000, 1500];
startButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    const selectedMethod = sortMethodSelect.value;
    if (currentSizeIndex < sizes.length) {
        startButton.disabled = true;
        const size = sizes[currentSizeIndex];
        const timeString = yield sortAndMeasureTime(sortMethods[selectedMethod], size);
        alert(`Массив из ${size} элементов отсортирован за ${timeString}.`);
        currentSizeIndex++;
        if (currentSizeIndex >= sizes.length) {
            currentSizeIndex = 0;
        }
        startButton.disabled = false;
    }
}));
const sortMethods = {
    bubbleSort,
    combSort,
    quickSort,
    heapSort,
    shakerSort
};

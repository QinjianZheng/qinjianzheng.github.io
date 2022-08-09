---
layout: post
title: Quick Sort
---

Quick sort implementation and problems related to it.

<!--more-->

The idea of quick sort is to divide and conquer. For an unsorted array, pick a random number (pivot element) in the array and divide it into two parts, and make sure each element in the left part is less than the pivot and each element in the right part is larger than the pivot. Then, sort the two parts applying the same method.

### Implementation from "Introduction of Algorithms"

<hr/>

```c
// quicksort implementaton using C

static void swap(int *a, int *b) {
    int temp = *b;
    *b = *a;
    *a = temp;
}

static int partition(int *array, int left, int right) {
    int x = array[right];
    int i = left - 1;
    for(int j = left; j < right; j++) {
        if(array[j] <= x) {
            i++;
            swap(&array[i], &array[j]);
        }
    }
    swap(&array[i+1], &array[right]);
    return i+1;
}

void quicksort(int *array, int left, int right) {
    int pivot;
    if(left < right) {
        pivot = partition(array, left, right);
        quicksort(array, left, pivot - 1);
        quicksort(array, pivot+1, right);
    }
}
```

```javascript
// quicksort implementaton using JavaScript
// swap two values [a, b] = [b, a]; cool

const partition = (array, left, right) => {
  let pivot = array[right];
  let i = left - 1;
  for (let j = left; j < right; j++) {
    if (array[j] <= pivot) {
      i++;
      [array[j], array[i]] = [array[i], array[j]];
    }
  }
  [array[i + 1], array[right]] = [array[right], array[i + 1]];
  return i + 1;
};

const quicksort = (array, left, right) => {
  if (left < right) {
    let pivot = partition(array, left, right);
    quicksort(array, left, pivot - 1);
    quicksort(array, pivot + 1, right);
  }
};
```

### Find the median in the unsorted array with time complexity less than O(nlogn)

<hr/>

Let's define median to be the number in the array with index of (size/2) when size is even and that with index of (size-1/2) when size is odd.

To find the median in an unsorted array, we can use the theory of quick sort, or the partition method.

```c
// partition function is metioned above
int getMedian(int *array, int size) {
    int left = 0;
    int right = size-1;
    int medianIdx;
    if(size % 2 == 0) {
        medianIdx = size/2;
    } else {
        medianIdx = (size-1)/2;
    }
    int pivot = partition(array, left, right);
    while(pivot != medianIdx) {
        if(pivot < medianIdx) {
            pivot = partition(array, pivot + 1, right);
        } else if(pivot > medianIdx) {
            pivot = partition(array, left, pivot - 1);
        }
    }
    return pivot;
}
```

We have already know that function partition will give us a pivot with all numbers in its left are less than it and all numbers in its right are greater than it, so instead of sorting the whole array, we can simply locate the pivot after first partition,

1. compare it to the median index, and then
2. perform partition to the left part when pivot is greater than median index and perform to the right part when pivot is smaller, (since left part has more numbers and all numbers are less than those in right part, median must be in the left part, similar reasoning applies when pivot is smaller than median index).

Until we find the median index to be the pivot, we continue performing the previous (1) and (2) operations.

Because, for each loop, we only consider one of partitions, the time complexity of the loop is less than O(logn), and the time complexity of function partition is O(n), hence the total time complexity is less than O(nlogn).

import { HeapElement } from "../types";

class MinHeap<T extends HeapElement> {
  heap: Array<T>;

  constructor() {
    this.heap = [];
  }

  add(item: T) {
    this.heap.push(item);
    this.heapifyUp(this.heap.length - 1);
  }

  pop(key: string): T | undefined {
    const index = this.heap.findIndex((item) => item.key === key);
    if (index === -1) return undefined;

    if (index === this.heap.length - 1) {
      return this.heap.pop();
    }

    const removedItem = this.heap[index];
    this.heap[index] = this.heap.pop()!;

    this.heapifyDown(index);
    this.heapifyDown(index);
    return removedItem;
  }

  popMin(): T | undefined {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap.pop();
    const min = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.heapifyDown(0);
    return min;
  }

  heapifyUp(index: number) {
    let curr = index;
    while (curr > 0) {
      const parent = Math.floor((curr - 1) / 2);
      if (this.compare(this.heap[curr], this.heap[parent]) < 0) {
        this.swap(curr, parent);
        curr = parent;
      } else {
        break;
      }
    }
  }
  // not used as iteration is better O(nlogn) says GeekforGeeks
  heapifyUpWithRecursion(index: number) {
    if (index === 0) return;

    const p = this.parent(index);
    const parentV = this.heap[p];
    const v = this.heap[index];

    if (parentV > v) {
      this.swap(p, index);
      this.heapifyUpWithRecursion(p);
    }
  }

  heapifyDown(index: number) {
    let curr = index;
    while (curr < this.heap.length) {
      const leftChild = this.leftChild(curr);
      const rightChild = this.rightChild(curr);
      let smallest = curr;
      if (
        leftChild < this.heap.length &&
        this.compare(this.heap[leftChild], this.heap[smallest]) < 0
      ) {
        smallest = leftChild;
      }
      if (
        rightChild < this.heap.length &&
        this.compare(this.heap[rightChild], this.heap[smallest]) < 0
      ) {
        smallest = rightChild;
      }

      if (smallest === curr) {
        break;
      }
      this.swap(curr, smallest);
      curr = smallest;
    }
  }
  // not used as iteration is better O(nlogn) says GeekforGeeks
  heapifyDownWithRecursion(index: number) {
    const leftChild = this.leftChild(index);
    const rightChild = this.rightChild(index);

    if (index >= this.heap.length || leftChild >= this.heap.length) return;

    let smallest = index;

    if (
      leftChild < this.heap.length &&
      this.compare(this.heap[leftChild], this.heap[smallest]) < 0
    ) {
      smallest = leftChild;
    }

    if (
      rightChild < this.heap.length &&
      this.compare(this.heap[rightChild], this.heap[smallest]) < 0
    ) {
      smallest = rightChild;
    }

    if (smallest !== index) {
      this.swap(index, smallest);
      this.heapifyDownWithRecursion(smallest);
    }
  }

  private parent(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  private leftChild(index: number): number {
    return index * 2 + 1;
  }

  private rightChild(index: number): number {
    return index * 2 + 2;
  }

  size(): number {
    return this.heap.length;
  }

  peek(): T | undefined {
    if (this.heap.length === 0) return undefined;
    return this.heap[0];
  }

  compare(a: T, b: T): number {
    if (a.count !== b.count) {
      return a.count - b.count;
    }
    return a.createdAt - b.createdAt;
  }

  swap(index1: number, index2: number) {
    [this.heap[index1], this.heap[index2]] = [
      this.heap[index2],
      this.heap[index1],
    ];
  }
}
export default MinHeap;

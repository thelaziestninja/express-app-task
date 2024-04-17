import { StoreElement } from "../types";

interface HeapNode {
  key: string;
  value: StoreElement;
}
class MinHeap {
  private heap: HeapNode[];

  constructor() {
    this.heap = [];
  }

  add(key: string, value: StoreElement) {
    const newNode: HeapNode = { key, value };
    this.heap.push(newNode);
    this.heapifyUp(this.heap.length - 1);
  }

  remove(key: string) {
    const index = this.heap.findIndex((item) => item.key === key);
    if (index === -1) return undefined;

    if (index === this.heap.length - 1) {
      return this.heap.pop();
    }

    const removedItem = this.heap[index];
    this.heap[index] = this.heap.pop()!;

    this.heapifyDown(index);
    return removedItem;
  }

  pop() {
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
      if (this.compare(this.heap[curr].value, this.heap[parent].value) < 0) {
        this.swap(curr, parent);
        curr = parent;
      } else {
        break;
      }
    }
  }

  heapifyDown(index: number) {
    let curr = index;
    while (curr < this.heap.length) {
      const leftChild = 2 * curr + 1;
      const rightChild = 2 * curr + 2;
      let smallest = curr;
      if (
        leftChild < this.heap.length &&
        this.compare(this.heap[leftChild].value, this.heap[smallest].value) < 0
      ) {
        smallest = leftChild;
      }
      if (
        rightChild < this.heap.length &&
        this.compare(this.heap[rightChild].value, this.heap[smallest].value) < 0
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

  compare(a: StoreElement, b: StoreElement) {
    if (a.count !== b.count) {
      return a.count - b.count;
    }
    return Number(a.created_at) - Number(b.created_at);
  }

  swap(index1: number, index2: number) {
    [this.heap[index1], this.heap[index2]] = [
      this.heap[index2],
      this.heap[index1],
    ];
  }
}
export default MinHeap;

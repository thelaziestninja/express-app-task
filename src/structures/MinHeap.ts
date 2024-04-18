import { StoreElement } from "../types";

class MinHeap {
  private heap: StoreElement[];

  constructor() {
    this.heap = [];
  }

  add(item: StoreElement) {
    item.heapIndex = this.heap.length;
    this.heap.push(item);
    this.heapifyUp(this.heap.length - 1);
  }

  remove(item: StoreElement): void {
    const index = item.heapIndex;
    if (index === undefined || index < 0 || index >= this.heap.length)
      return undefined;

    this.swap(index, this.heap.length - 1);
    this.heap.pop();

    if (this.heap.length > 0 && index < this.heap.length) {
      this.heapifyDown(index);
      this.heapifyUp(index);
    }
  }

  pop() {
    if (this.heap.length === 0) return undefined;
    const min = this.heap[0];
    const end = this.heap.pop();
    if (this.heap.length > 0 && end !== undefined) {
      this.heap[0] = end;
      this.heap[0].heapIndex = 0;
      this.heapifyDown(0);
    }
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

  heapifyDown(heapIndex: number) {
    let curr = heapIndex;
    const last = this.heap.length - 1;
    while (true) {
      let smallest = curr;
      const leftChild = 2 * curr + 1;
      const rightChild = 2 * curr + 2;

      if (
        leftChild <= this.heap.length &&
        this.compare(this.heap[leftChild], this.heap[smallest]) < 0
      ) {
        smallest = leftChild;
      }
      if (
        rightChild <= last &&
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

  compare(a: StoreElement, b: StoreElement) {
    if (a.count !== (b.count ?? 0)) {
      return (a.count ?? 0) - (b.count ?? 0);
    }
    return Number(a.created_at) - Number(b.created_at);
  }

  swap(i: number, j: number) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    this.heap[i].heapIndex = i;
    this.heap[j].heapIndex = j;
  }
}
//nqkude mejdu tezi dve metoda heapify up i heapify down trqbva da promenqm i index-a na samiq item

export default MinHeap;

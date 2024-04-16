class PriorityQueue {
  heap: Array<{ key: string; createdAt: number; count: number }>;

  constructor() {
    this.heap = [];
  }

  add(key: string, createdAt: number, count: number) {
    this.heap.push({ key, createdAt, count });
    this.heapifyUp(this.heap.length - 1);
  }

  remove(
    key: string
  ): { key: string; createdAt: number; count: number } | undefined {
    const index = this.heap.findIndex((item) => item.key === key);
    if (index === -1) return undefined;

    const removedItem = this.heap[index];
    this.heap[index] = this.heap.pop()!;
    this.heapifyDown(index);
    return removedItem;
  }

  removeMin(): { key: string; createdAt: number; count: number } | undefined {
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

  heapifyDown(index: number) {
    let curr = index;
    while (curr < this.heap.length) {
      const leftChild = 2 * curr + 1;
      const rightChild = 2 * curr + 2;
      let smallerChild = -1;
      if (leftChild < this.heap.length) {
        smallerChild = leftChild;
        if (
          rightChild < this.heap.length &&
          this.compare(this.heap[rightChild], this.heap[leftChild]) < 0
        ) {
          smallerChild = rightChild;
        }
      }
      if (
        smallerChild === -1 ||
        this.compare(this.heap[curr], this.heap[smallerChild]) <= 0
      ) {
        break;
      }
      this.swap(curr, smallerChild);
      curr = smallerChild;
    }
  }

  peek() {
    if (this.heap.length === 0) return undefined;
    return this.heap[0];
  }

  compare(
    a: { createdAt: number; count: number },
    b: { createdAt: number; count: number }
  ): number {
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
export default PriorityQueue;

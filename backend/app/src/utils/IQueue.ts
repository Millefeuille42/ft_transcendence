interface IQueue<T> {
	enqueue(item: T): void
	dequeue(): T | undefined
	getStorage() : T[]
	size(): number
}

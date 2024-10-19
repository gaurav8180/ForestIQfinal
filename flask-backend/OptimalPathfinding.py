import heapq
import numpy as np
import math

class OptimalPathing:
    def __init__(self, binary_image, PATH):
        self.img = binary_image  # This should be the binary image
        self.PATH = PATH

    # Precompute Euclidean distances for the entire image
    def Precompute_EuclideanDist(self, rows, cols):
        dist = np.zeros((rows, cols))
        for i in range(rows):
            for j in range(cols):
                dist[i, j] = np.hypot(i - (rows - 1), j - (cols - 1))
        return dist

    # Create graph for pathfinding based on pixel densities and distances
    def create_graph(self, binary_image, target):
        rows, cols = binary_image.shape
        graph = {}

        # Precompute Euclidean distances
        euclidean_distances = self.Precompute_EuclideanDist(rows, cols)
        TCD_FACTOR = math.exp(115 / (rows * cols) * 1000 * 100)

        for i in range(rows):
            for j in range(cols):
                neighbors = []
                for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:  # 4-connected grid
                    ni, nj = i + dx, j + dy
                    if 0 <= ni < rows and 0 <= nj < cols:
                        avg_density = 255 - binary_image[ni, nj]
                        weight = (TCD_FACTOR * (255 - binary_image[ni, nj]) +
                                  euclidean_distances[ni, nj] +
                                  50000 * np.log(avg_density + 1))
                        neighbors.append(((ni, nj), weight))
                graph[(i, j)] = neighbors
        return graph

    # Trace the shortest path based on parent pointers
    def trace_path(self, parents, start, target):
        path = []
        current = target
        while current != start:
            path.append(current)
            current = parents[current]
        path.append(start)
        path.reverse()
        return path

    # Dijkstra's algorithm for finding the shortest path
    def ComputeDijkstra(self, start_pixel=(0, 0), target_pixel=(800, 1400)):
        graph = self.create_graph(self.img, target_pixel)

        # Dijkstra's Algorithm Initialization
        parents = {}
        heap = [(0, start_pixel)]
        visited = set()

        while heap:
            cost, current = heapq.heappop(heap)

            if current in visited:
                continue

            visited.add(current)

            if current == target_pixel:
                break

            for neighbor, weight in graph[current]:
                if neighbor not in visited:
                    parents[neighbor] = current
                    heapq.heappush(heap, (cost + weight, neighbor))

        # Trace the shortest path
        shortest_path = self.trace_path(parents, start_pixel, target_pixel)

        return shortest_path
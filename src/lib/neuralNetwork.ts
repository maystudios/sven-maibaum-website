/**
 * Small feed-forward network used by the publication illustration and the
 * signature hero of motion variant 3. Pure functions only; rendering lives in
 * the components.
 */

export type NetworkNode = { x: number; y: number };

export type NetworkParams = {
  weights: number[][][]; // weights[layer][fromNode][toNode]
  biases: number[][]; // biases[layer][node] (layers 1..n, index 0 = first hidden)
};

export type NetworkConnection = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  fromLayer: number;
  fromIdx: number;
  toIdx: number;
};

// Layer colors: input=green, hidden=blue, output=red, winner=purple
export const LAYER_COLORS = ["#22c55e", "#3b82f6", "#3b82f6", "#ef4444"];
export const LAYER_COLORS_DIM = ["#166534", "#1e3a5f", "#1e3a5f", "#7f1d1d"];
export const SYNAPSE_COLORS = ["#22c55e", "#3b82f6", "#ef4444"];
export const WINNER_COLOR = "#a855f7";
export const WINNER_COLOR_DIM = "#581c87";
export const LAYER_LABELS = ["Input", "Hidden", "Hidden", "Output"];

export function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x));
}

/** Cosine ease-in-out: smooth S-curve with zero velocity at both ends. */
export function cosEase(t: number) {
  return (1 - Math.cos(t * Math.PI)) / 2;
}

/** Deterministic PRNG (mulberry32) for a network that looks the same on every visit. */
export function seededRandom(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildLayers(topology: number[], xPositions: number[], midY: number, gapY: number): NetworkNode[][] {
  return topology.map((count, l) => {
    const startY = midY - ((count - 1) * gapY) / 2;
    return Array.from({ length: count }, (_, i) => ({
      x: xPositions[l],
      y: startY + i * gapY,
    }));
  });
}

export function buildConnections(layers: NetworkNode[][]): NetworkConnection[] {
  const connections: NetworkConnection[] = [];
  for (let l = 0; l < layers.length - 1; l++) {
    for (let i = 0; i < layers[l].length; i++) {
      for (let j = 0; j < layers[l + 1].length; j++) {
        connections.push({
          x1: layers[l][i].x,
          y1: layers[l][i].y,
          x2: layers[l + 1][j].x,
          y2: layers[l + 1][j].y,
          fromLayer: l,
          fromIdx: i,
          toIdx: j,
        });
      }
    }
  }
  return connections;
}

export function initParams(topology: number[], random: () => number = Math.random): NetworkParams {
  const weights: number[][][] = [];
  const biases: number[][] = [];
  for (let l = 0; l < topology.length - 1; l++) {
    // Xavier-ish initialization: scale by 1/sqrt(fan_in)
    const scale = 1 / Math.sqrt(topology[l]);
    weights[l] = [];
    for (let i = 0; i < topology[l]; i++) {
      weights[l][i] = [];
      for (let j = 0; j < topology[l + 1]; j++) {
        weights[l][i][j] = (random() * 2 - 1) * scale * 2.5;
      }
    }
    // Bias per neuron in the target layer
    biases[l] = Array.from({ length: topology[l + 1] }, () => (random() - 0.5) * 0.5);
  }
  return { weights, biases };
}

/** Full forward pass: a_j = σ( Σᵢ(aᵢ · wᵢⱼ) + bⱼ ) */
export function forwardPass(topology: number[], inputs: number[], params: NetworkParams) {
  const activations: number[][] = [inputs];
  let current = inputs;
  for (let l = 0; l < params.weights.length; l++) {
    const next: number[] = [];
    for (let j = 0; j < topology[l + 1]; j++) {
      // Weighted sum: z = Σ(aᵢ · wᵢⱼ)
      let z = 0;
      for (let i = 0; i < current.length; i++) {
        z += current[i] * params.weights[l][i][j];
      }
      // Add bias: z += bⱼ
      z += params.biases[l][j];
      // Activation function: a = σ(z)
      next.push(sigmoid(z));
    }
    activations.push(next);
    current = next;
  }
  return activations;
}

/**
 * Per-layer draw-in for a wave that travels from the first to the last layer.
 * `waveX` is the wave front in the same units as `xPositions`.
 */
export function layerDraw(xPositions: number[], waveX: number, spread: number) {
  return xPositions.map((x) => {
    const raw = (waveX - x + spread * 0.5) / spread;
    return cosEase(Math.max(0, Math.min(1, raw)));
  });
}

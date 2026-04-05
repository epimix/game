import { useState, useCallback, useEffect } from 'react';

export type Card = {
  id: string;
  pairId: string | number;
  imageUri: string | null;
  isFlipped: boolean;
  isMatched: boolean;
};

const GRID_SIZE = 16; 

export const useMemoryLogic = (customImages: string[]) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isBusy, setIsBusy] = useState(false);

  const initGame = useCallback(() => {
    const pairCount = GRID_SIZE / 2;
    const initialPairs = [];

    // Default icon names if no custom images provided
    const defaultIcons = [
        'heart', 'star', 'sunny', 'moon', 'flame', 'flash', 'leaf', 'water'
    ];

    for (let i = 0; i < pairCount; i++) {
        const imageUri = customImages[i] || null;
        const pairId = imageUri || defaultIcons[i];
        
        const card1: Card = {
            id: `card-${i}-a`,
            pairId,
            imageUri,
            isFlipped: false,
            isMatched: false,
        };
        const card2: Card = {
            id: `card-${i}-b`,
            pairId,
            imageUri,
            isFlipped: false,
            isMatched: false,
        };
        initialPairs.push(card1, card2);
    }

    // Shuffle
    const shuffled = initialPairs.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedIndices([]);
    setMoves(0);
    setMatches(0);
    setIsBusy(false);
  }, [customImages]);

  useEffect(() => {
    initGame();
  }, [customImages]);

  const handleFlip = useCallback((index: number) => {
    if (isBusy || cards[index].isMatched || cards[index].isFlipped || flippedIndices.length === 2) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
        setMoves(prev => prev + 1);
        const [idx1, idx2] = newFlipped;
        
        if (newCards[idx1].pairId === newCards[idx2].pairId) {
            // Match
            newCards[idx1].isMatched = true;
            newCards[idx2].isMatched = true;
            setCards(newCards);
            setMatches(prev => prev + 1);
            setFlippedIndices([]);
        } else {
            // Mismatch
            setIsBusy(true);
            setTimeout(() => {
                newCards[idx1].isFlipped = false;
                newCards[idx2].isFlipped = false;
                setCards(newCards);
                setFlippedIndices([]);
                setIsBusy(false);
            }, 1000);
        }
    }
  }, [cards, flippedIndices, isBusy]);

  return {
    cards,
    moves,
    matches,
    isWon: matches === GRID_SIZE / 2,
    handleFlip,
    reset: initGame,
  };
};

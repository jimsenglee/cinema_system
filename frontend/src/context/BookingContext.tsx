import { createContext, useContext, useState, ReactNode } from "react";
import { Movie, Showtime, Seat, ConcessionItem } from "@/data/mockData";

interface ConcessionOrder {
  item: ConcessionItem;
  quantity: number;
}

interface BookingState {
  movie: Movie | null;
  showtime: Showtime | null;
  selectedSeats: string[];
  seatDetails: Seat[];
  concessions: ConcessionOrder[];
  ticketTotal: number;
  concessionTotal: number;
}

interface BookingContextType extends BookingState {
  setMovie: (movie: Movie) => void;
  setShowtime: (showtime: Showtime) => void;
  toggleSeat: (seatId: string) => void;
  setSeatDetails: (seats: Seat[]) => void;
  updateConcession: (item: ConcessionItem, quantity: number) => void;
  clearBooking: () => void;
  calculateTotal: () => number;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<BookingState>({
    movie: null,
    showtime: null,
    selectedSeats: [],
    seatDetails: [],
    concessions: [],
    ticketTotal: 0,
    concessionTotal: 0,
  });

  const setMovie = (movie: Movie) => {
    setState(prev => ({ ...prev, movie }));
  };

  const setShowtime = (showtime: Showtime) => {
    setState(prev => ({ 
      ...prev, 
      showtime,
      selectedSeats: [],
      seatDetails: [],
      ticketTotal: 0
    }));
  };

  const toggleSeat = (seatId: string) => {
    setState(prev => {
      const isSelected = prev.selectedSeats.includes(seatId);
      const newSelectedSeats = isSelected
        ? prev.selectedSeats.filter(id => id !== seatId)
        : [...prev.selectedSeats, seatId];
      
      return { ...prev, selectedSeats: newSelectedSeats };
    });
  };

  const setSeatDetails = (seats: Seat[]) => {
    setState(prev => {
      const selectedSeatDetails = seats.filter(s => prev.selectedSeats.includes(s.id));
      const ticketTotal = selectedSeatDetails.reduce((total, seat) => {
        if (!prev.showtime) return total;
        return total + (seat.type === "VIP" || seat.type === "Twin" 
          ? prev.showtime.vipPrice 
          : prev.showtime.price);
      }, 0);
      
      return { ...prev, seatDetails: selectedSeatDetails, ticketTotal };
    });
  };

  const updateConcession = (item: ConcessionItem, quantity: number) => {
    setState(prev => {
      let newConcessions: ConcessionOrder[];
      
      if (quantity === 0) {
        newConcessions = prev.concessions.filter(c => c.item.id !== item.id);
      } else {
        const existingIndex = prev.concessions.findIndex(c => c.item.id === item.id);
        if (existingIndex >= 0) {
          newConcessions = [...prev.concessions];
          newConcessions[existingIndex] = { item, quantity };
        } else {
          newConcessions = [...prev.concessions, { item, quantity }];
        }
      }
      
      const concessionTotal = newConcessions.reduce(
        (total, c) => total + c.item.price * c.quantity, 
        0
      );
      
      return { ...prev, concessions: newConcessions, concessionTotal };
    });
  };

  const clearBooking = () => {
    setState({
      movie: null,
      showtime: null,
      selectedSeats: [],
      seatDetails: [],
      concessions: [],
      ticketTotal: 0,
      concessionTotal: 0,
    });
  };

  const calculateTotal = () => {
    return state.ticketTotal + state.concessionTotal;
  };

  return (
    <BookingContext.Provider value={{
      ...state,
      setMovie,
      setShowtime,
      toggleSeat,
      setSeatDetails,
      updateConcession,
      clearBooking,
      calculateTotal,
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};

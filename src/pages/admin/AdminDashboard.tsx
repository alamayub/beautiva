import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';
import { AdminOverview } from './AdminOverview';
import { AdminBookings } from './AdminBookings';
import { AdminStylists } from './AdminStylists';
import { AdminCatalog } from './AdminCatalog';
import { AdminInventory } from './AdminInventory';
import { AdminAcademy } from './AdminAcademy';
import { AdminAnalytics } from './AdminAnalytics';
import { 
  initialBookings, 
  initialStylists, 
  initialInventory, 
  BookingRecord, 
  StylistRecord, 
  InventoryItem 
} from '../../data/dashboardData';

export const AdminDashboard: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    try {
      const stored = localStorage.getItem('beautiva_admin_bookings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return initialBookings;
  });

  const [stylists, setStylists] = useState<StylistRecord[]>(() => {
    try {
      const stored = localStorage.getItem('beautiva_admin_stylists');
      if (stored) return JSON.parse(stored);
    } catch {}
    return initialStylists;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const stored = localStorage.getItem('beautiva_admin_inventory');
      if (stored) return JSON.parse(stored);
    } catch {}
    return initialInventory;
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('beautiva_admin_bookings', JSON.stringify(bookings));
    } catch {}
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem('beautiva_admin_stylists', JSON.stringify(stylists));
    } catch {}
  }, [stylists]);

  useEffect(() => {
    try {
      localStorage.setItem('beautiva_admin_inventory', JSON.stringify(inventory));
    } catch {}
  }, [inventory]);

  const handleUpdateBooking = (updated: BookingRecord) => {
    setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  };

  const handleUpdateBookingStatus = (id: string, status: BookingRecord['status']) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const handleAddBooking = (newBooking: BookingRecord) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  const handleAddStylist = (newStylist: StylistRecord) => {
    setStylists((prev) => [newStylist, ...prev]);
  };

  const handleToggleStylistStatus = (id: string, status: StylistRecord['status']) => {
    setStylists((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  const handleRestockInventory = (id: string, additionalUnits: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStock = item.currentStock + additionalUnits;
          return {
            ...item,
            currentStock: newStock,
            status: newStock <= item.minThreshold ? 'low_stock' : 'sufficient'
          };
        }
        return item;
      })
    );
  };

  const lowStockCount = inventory.filter(
    (i) => i.status === 'low_stock' || i.currentStock <= i.minThreshold
  ).length;

  return (
    <Routes>
      <Route
        element={
          <AdminLayout
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            bookingCount={bookings.filter(b => b.status === 'pending' || b.status === 'assigned').length}
            lowStockCount={lowStockCount}
          />
        }
      >
        <Route
          index
          element={
            <AdminOverview
              bookings={bookings}
              stylists={stylists}
              inventory={inventory}
              selectedCity={selectedCity}
              onUpdateBookingStatus={handleUpdateBookingStatus}
            />
          }
        />
        <Route
          path="bookings"
          element={
            <AdminBookings
              bookings={bookings}
              stylists={stylists}
              selectedCity={selectedCity}
              onUpdateBooking={handleUpdateBooking}
              onAddBooking={handleAddBooking}
            />
          }
        />
        <Route
          path="stylists"
          element={
            <AdminStylists
              stylists={stylists}
              selectedCity={selectedCity}
              onAddStylist={handleAddStylist}
              onToggleStatus={handleToggleStylistStatus}
            />
          }
        />
        <Route path="catalog" element={<AdminCatalog />} />
        <Route
          path="inventory"
          element={
            <AdminInventory
              inventory={inventory}
              onRestock={handleRestockInventory}
            />
          }
        />
        <Route path="academy" element={<AdminAcademy />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>
    </Routes>
  );
};

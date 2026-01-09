import { Ticket, TicketStatus, TicketCategory } from './types';

const TICKETS_KEY = 'ticz_tickets';

export const ticketStore = {
  getAll(): Ticket[] {
    if (typeof window === 'undefined') return [];
    const tickets = localStorage.getItem(TICKETS_KEY);
    return tickets ? JSON.parse(tickets) : [];
  },

  getById(id: string): Ticket | null {
    const tickets = this.getAll();
    return tickets.find(t => t.id === id) || null;
  },

  getByStatus(status: TicketStatus): Ticket[] {
    return this.getAll().filter(t => t.status === status);
  },

  getByCategory(category: TicketCategory): Ticket[] {
    return this.getAll().filter(t => t.category === category);
  },

  getByUser(userId: string): Ticket[] {
    return this.getAll().filter(t => t.userId === userId);
  },

  create(ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Ticket {
    const newTicket: Ticket = {
      ...ticket,
      id: `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const tickets = this.getAll();
    tickets.push(newTicket);
    localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
    return newTicket;
  },

  update(id: string, updates: Partial<Ticket>): Ticket | null {
    const tickets = this.getAll();
    const index = tickets.findIndex(t => t.id === id);
    
    if (index === -1) return null;

    tickets[index] = {
      ...tickets[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
    return tickets[index];
  },

  delete(id: string): boolean {
    const tickets = this.getAll();
    const filtered = tickets.filter(t => t.id !== id);
    
    if (filtered.length === tickets.length) return false;

    localStorage.setItem(TICKETS_KEY, JSON.stringify(filtered));
    return true;
  },

  getStats(userId?: string) {
    const tickets = userId ? this.getByUser(userId) : this.getAll();
    
    return {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'open').length,
      pending: tickets.filter(t => t.status === 'pending').length,
      closed: tickets.filter(t => t.status === 'closed').length,
    };
  },
};
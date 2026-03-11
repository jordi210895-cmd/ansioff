export interface EmergencyContact {
    id: string;
    name: string;
    role: string;
    phone: string;
}

const CONTACTS_KEY = 'ansioff_emergency_contacts';

export const getEmergencyContacts = (): EmergencyContact[] => {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(CONTACTS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("Failed to parse contacts", e);
        return [];
    }
};

export const saveEmergencyContacts = (contacts: EmergencyContact[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
};

export const addEmergencyContact = (contact: Omit<EmergencyContact, 'id'>): EmergencyContact => {
    const contacts = getEmergencyContacts();
    const newContact: EmergencyContact = {
        ...contact,
        id: crypto.randomUUID()
    };
    contacts.push(newContact);
    saveEmergencyContacts(contacts);
    return newContact;
};

export const removeEmergencyContact = (id: string): void => {
    const contacts = getEmergencyContacts();
    saveEmergencyContacts(contacts.filter(c => c.id !== id));
};

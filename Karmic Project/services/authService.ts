import { User } from '../types';

// Mock database of users. In a real app, this would be a server call.
const mockUsers: User[] = [
    { 
        id: 'E12345', 
        name: 'Jane Doe', 
        email: 'jane.doe@karmicsolutions.com', 
        phone: '9876543210', 
        password: 'password123' 
    },
    { 
        id: 'E67890', 
        name: 'Peter Jones', 
        email: 'peter.jones@karmicsolutions.com', 
        phone: '9876543211', 
        password: 'password456' 
    },
];

export const authService = {
    login: (email: string, password: string): Promise<{ user: User | null; error?: string }> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
                if (user) {
                    const { password, ...userWithoutPassword } = user;
                    resolve({ user: userWithoutPassword as User });
                } else {
                    resolve({ user: null, error: 'Invalid email or password.' });
                }
            }, 700);
        });
    },

    register: (newUser: Omit<User, 'id'> & { id: string }): Promise<{ user: User | null; error?: string }> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const emailExists = mockUsers.some(u => u.email.toLowerCase() === newUser.email.toLowerCase());
                if (emailExists) {
                    resolve({ user: null, error: 'An account with this email already exists.' });
                    return;
                }

                const idExists = mockUsers.some(u => u.id.toLowerCase() === newUser.id.toLowerCase());
                if (idExists) {
                    resolve({ user: null, error: 'An account with this Employee ID already exists.' });
                    return;
                }
                
                // Add user to our mock DB
                mockUsers.push(newUser);
                const { password, ...userWithoutPassword } = newUser;

                resolve({ user: userWithoutPassword as User });

            }, 700);
        });
    },
};
import { AuthUser, LoginRequest, SignUpRequest, AuthResponse } from '../types';
// import { supabase } from '../config/supabase';

class AuthService {
  private readonly STORAGE_KEY = 'credit_scorecerer_auth';

  // Check if Supabase is configured (disabled for now)
  private get isSupabaseConfigured(): boolean {
    return false; // Force demo mode
    // return !!(process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_ANON_KEY);
  }

  // Fallback mock user database
  private mockUsers: AuthUser[] = [
    {
      id: '1',
      email: 'demo@example.com',
      name: 'Demo User',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      email: 'john.doe@example.com',
      name: 'John Doe',
      createdAt: '2024-01-15T00:00:00Z'
    },
    {
      id: '3',
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      createdAt: '2024-02-01T00:00:00Z'
    }
  ];

  async signUp(request: SignUpRequest): Promise<AuthResponse> {
    // Validate input
    if (!request.name || !request.email || !request.password) {
      throw new Error('All fields are required');
    }

    if (request.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    if (!this.isValidEmail(request.email)) {
      throw new Error('Please enter a valid email address');
    }

    // Supabase integration disabled for now - using demo mode
    /*
    if (this.isSupabaseConfigured) {
      try {
        // Use Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: request.email,
          password: request.password,
          options: {
            data: {
              name: request.name
            }
          }
        });

        if (authError) {
          throw new Error(authError.message);
        }

        if (!authData.user) {
          throw new Error('Failed to create user account');
        }

        // Create user profile in our custom users table
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: request.email,
            name: request.name
          });

        if (profileError) {
          console.error('Error creating user profile:', profileError);
          // Don't throw error here as the auth user was created successfully
        }

        const user: AuthUser = {
          id: authData.user.id,
          email: request.email,
          name: request.name,
          createdAt: authData.user.created_at
        };

        const response: AuthResponse = {
          user,
          token: authData.session?.access_token || ''
        };

        return response;
      } catch (error) {
        console.error('Supabase signup error:', error);
        throw error;
      }
    } else {
    */
      // Using mock implementation (demo mode)
      console.log('Using demo authentication mode');
      return this.mockSignUp(request);
    // }
  }

  async login(request: LoginRequest): Promise<AuthResponse> {
    // Validate input
    if (!request.email || !request.password) {
      throw new Error('Email and password are required');
    }

    // Supabase integration disabled for now - using demo mode
    /*
    if (this.isSupabaseConfigured) {
      try {
        // Use Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: request.email,
          password: request.password
        });

        if (authError) {
          throw new Error(authError.message);
        }

        if (!authData.user || !authData.session) {
          throw new Error('Invalid email or password');
        }

        // Get user profile from our custom users table
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          // Use auth user data as fallback
          const user: AuthUser = {
            id: authData.user.id,
            email: authData.user.email || '',
            name: authData.user.user_metadata?.name || 'User',
            createdAt: authData.user.created_at
          };

          return {
            user,
            token: authData.session.access_token
          };
        }

        const user: AuthUser = {
          id: userProfile.id,
          email: userProfile.email,
          name: userProfile.name,
          createdAt: userProfile.created_at
        };

        const response: AuthResponse = {
          user,
          token: authData.session.access_token
        };

        return response;
      } catch (error) {
        console.error('Supabase login error:', error);
        throw error;
      }
    } else {
    */
      // Using mock implementation (demo mode)
      console.log('Using demo authentication mode');
      return this.mockLogin(request);
    // }
  }

  async logout(): Promise<void> {
    // Supabase integration disabled for now - using demo mode
    /*
    if (this.isSupabaseConfigured) {
      try {
        // Use Supabase Auth logout
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('Supabase logout error:', error);
        }
      } catch (error) {
        console.error('Supabase logout error:', error);
      }
    } else {
    */
      // Using mock implementation (demo mode)
      console.log('Using demo authentication mode');
      await new Promise(resolve => setTimeout(resolve, 500));
    // }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    // Supabase integration disabled for now - using demo mode
    /*
    if (this.isSupabaseConfigured) {
      try {
        // Get current session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          return null;
        }

        if (!session?.user) {
          return null;
        }

        // Get user profile from our custom users table
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          // Use auth user data as fallback
          return {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || 'User',
            createdAt: session.user.created_at
          };
        }

        return {
          id: userProfile.id,
          email: userProfile.email,
          name: userProfile.name,
          createdAt: userProfile.created_at
        };
      } catch (error) {
        console.error('Supabase getCurrentUser error:', error);
        return null;
      }
    } else {
    */
      // Using mock implementation (demo mode)
      console.log('Using demo authentication mode');
      return this.mockGetCurrentUser();
    // }
  }

  async refreshToken(): Promise<string | null> {
    // Supabase integration disabled for now - using demo mode
    /*
    if (this.isSupabaseConfigured) {
      try {
        // Supabase handles token refresh automatically
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          return null;
        }

        return session.access_token;
      } catch (error) {
        console.error('Supabase refreshToken error:', error);
        return null;
      }
    } else {
    */
      // Using mock implementation (demo mode)
      console.log('Using demo authentication mode');
      return this.mockRefreshToken();
    // }
  }

  // Mock fallback methods
  private async mockSignUp(request: SignUpRequest): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user already exists
    const existingUser = this.mockUsers.find(user => user.email === request.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const newUser: AuthUser = {
      id: (this.mockUsers.length + 1).toString(),
      email: request.email,
      name: request.name,
      createdAt: new Date().toISOString()
    };

    // Add to mock database
    this.mockUsers.push(newUser);

    // Generate mock token
    const token = this.generateMockToken(newUser.id);

    return {
      user: newUser,
      token
    };
  }

  private async mockLogin(request: LoginRequest): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For demo purposes, accept any password for demo@example.com
    if (request.email === 'demo@example.com') {
      const user = this.mockUsers.find(u => u.email === request.email);
      if (!user) {
        throw new Error('User not found');
      }

      const token = this.generateMockToken(user.id);
      return {
        user,
        token
      };
    }

    // Find user in mock database
    const user = this.mockUsers.find(u => u.email === request.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // In a real app, you would verify the password hash here
    // For demo purposes, we'll accept any password
    const token = this.generateMockToken(user.id);
    return {
      user,
      token
    };
  }

  private async mockGetCurrentUser(): Promise<AuthUser | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return demo user for mock mode
    return this.mockUsers[0];
  }

  private async mockRefreshToken(): Promise<string | null> {
    const currentUser = await this.mockGetCurrentUser();
    if (!currentUser) {
      return null;
    }

    return this.generateMockToken(currentUser.id);
  }

  private generateMockToken(userId: string): string {
    // In a real app, this would be generated by the server
    const payload = {
      userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    };
    
    return btoa(JSON.stringify(payload));
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Get auth data from localStorage (synchronous)
  getStoredAuth(): AuthResponse | null {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error parsing stored auth data:', error);
      return null;
    }
  }

  private storeAuth(authData: AuthResponse): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(authData));
  }

  private clearAuth(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export default new AuthService();

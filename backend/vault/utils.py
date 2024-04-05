from random import randint, choice, shuffle
import string


class PasswordGenerator:
    def __init__(self, password_len=12, has_upper_case=True, has_lower_case=True, has_digits=True, has_symbols=True):
        """User will decide how long their password should be, and whether it should contain upper case, 
        lower case, digits, symbols or any combination of the above. This class will automatically 
        assign the number of each character group"""
        self.upper_case_letters = [
                        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 
                        'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 
                        'Q', 'R', 'S','T', 'U', 'V',
                        'W', 'X', 'Y', 'Z']
        #string.ascii_uppercase

        self.lower_case_letters = ['a', 'b', 'c', 'd', 'e', 'f', 
                                   'g', 'h', 'i', 'j', 'k', 'l', 
                                   'm', 'n', 'o', 'p', 'q', 'r', 
                                   's','t', 'u', 'v','w', 'x', 
                                   'y', 'z']
        # string.ascii_lowercase
        self.digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
        #  string.digits)
        self.symbols = ['@', '#', '$', '%', '&', '(', ')', '*', '+', '!', '~']
        # "!@#$%^&*()-_=+[]{};:,.?"
        # distribute the available positions among character groups
        # Should have max and min password length constraints 
        # cannot be all false

        # Store the booleans in a list for easy processing.
        group_flags = [has_upper_case, has_lower_case, has_digits, has_symbols]
        
        # Initialize counts for each group to 0. Use a dict to map attributes for readability.
        self.counts = {'nbr_upper': 0, 'nbr_lower': 0, 'nbr_digits': 0, 'nbr_symbols': 0}
        
        # List of group names for direct mapping and assignment later.
        group_names = list(self.counts.keys())
        
        # Filter indices of active groups based on their flags.
        active_indices = [idx for idx, flag in enumerate(group_flags) if flag]
        self.password_len = int(password_len)
        
        print(self.password_len)
        # Distribute total_len across active groups.
        for _ in range(self.password_len):
            idx = active_indices[randint(0, len(active_indices) - 1)]
            self.counts[group_names[idx]] += 1


    def generate(self):
        # Create a pool of candidates to fill in the password
        
        # randomly pick from digits nbr_digits
        digit_candidates = [choice(self.digits) for _ in range(self.counts['nbr_digits'])]
        # randomly pick from letters nbr_letters
        upper_letter_candidates = [choice(self.upper_case_letters) for _ in range(self.counts['nbr_upper'])]
        lower_letter_candidates = [choice(self.lower_case_letters) for _ in range(self.counts['nbr_lower'])]
        # randomly pick from symbols nbr_symbols
        symbols_candidates = [choice(self.symbols) for _ in range(self.counts['nbr_symbols'])]

        candidates = []
        candidates.extend(digit_candidates)
        candidates.extend(upper_letter_candidates)
        candidates.extend(lower_letter_candidates)
        candidates.extend(symbols_candidates)

        # replace the placeholders of password at random index
        shuffle(candidates)
        return ''.join(candidates)

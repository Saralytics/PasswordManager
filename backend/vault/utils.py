from random import randint, choice, shuffle


class PasswordGenerator:
    def __init__(self):
        self.letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
                        't', 'u', 'v',
                        'w', 'x', 'y', 'z',
                        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
                        'T', 'U', 'V',
                        'W', 'X', 'Y', 'Z']

        self.digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

        self.symbols = ['@', '#', '$', '%', '&', '(', ')', '*', '+', '!']

        # Ask user preference of password
        # print("Let's generate a secure password for you!")
        # len_total = int(input("How long do you want your password to be?"))
        # nbr_digits = int(input("How many digits do you want in your password?"))
        # nbr_letters = int(input("How many letters do you want in your password?"))
        self.len_total = 10
        self.nbr_digits = 4
        self.nbr_letters = 4

        # the rest will be symbols
        self.nbr_symbols = self.len_total - self.nbr_digits - self.nbr_letters

    def generate(self):
        # Create a pool of candidates to fill in the password

        # randomly pick from digits nbr_digits
        digit_candidates = [choice(self.digits) for _ in range(self.nbr_digits)]
        # randomly pick from letters nbr_letters
        letter_candidates = [choice(self.letters) for _ in range(self.nbr_letters)]
        # randomly pick from symbols nbr_symbols
        symbols_candidates = [choice(self.symbols) for _ in range(self.nbr_symbols)]

        candidates = []
        candidates.extend(digit_candidates)
        candidates.extend(letter_candidates)
        candidates.extend(symbols_candidates)

        # replace the placeholders of password at random index

        shuffle(candidates)
        password = ''.join(candidates)
        return password

        # print(f"Here is your password: {password}")
// Problem: count-primes. Expected verdict: TLE
// Naive trial division by every number below i. Fine for small N, far too slow for N = 1,000,000.
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    int count = 0;
    for (int i = 2; i <= n; i++) {
        bool prime = true;
        for (int d = 2; d < i; d++) {
            if (i % d == 0) {
                prime = false;
                break;
            }
        }
        if (prime) count++;
    }
    cout << count << "\n";
    return 0;
}

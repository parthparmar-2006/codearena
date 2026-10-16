// Problem: maximum-subarray-sum. Expected verdict: WA
// Correct algorithm, but the running sum is an int. It overflows on the
// 3999999999 test, so the first 4 tests pass and the 5th fails.
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    int best = INT_MIN, current = 0;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        current = max(x, current + x);
        best = max(best, current);
    }
    cout << best << "\n";
    return 0;
}

// Problem: sum-of-two-numbers. Expected verdict: RE
// vector::at checks bounds and throws, which aborts the program.
#include <bits/stdc++.h>
using namespace std;

int main() {
    long long a, b;
    cin >> a >> b;
    vector<long long> answers(2);
    answers.at(10) = a + b;
    cout << answers.at(10) << "\n";
    return 0;
}

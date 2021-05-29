export const clamp = (a: number, b: number, c: number) => {
  return (a < b) ? b : (a > c) ? c : a;
}

export const resTreatment = (arr: number[]) => arr.map(v => Math.round(v * 1000) / 1000);

export const getCuadraticFunction = (a: number, b: number, c: number, d: number, aa = 0, bb = 0.33, cc = 0.66, dd = 1) => {
	const aaS = Math.pow(aa, 2);
	const bbS = Math.pow(bb, 2);
	const ccS = Math.pow(cc, 2);
	const ddS = Math.pow(dd, 2);
	const aaT = aaS * aa;
	const bbT = bbS * bb;
	const ccT = ccS * cc;
	const ddT = ddS * dd;
	const res = resTreatment(solve4x4(
		[aaT, bbT, ccT, ddT],
		[aaS, bbS, ccS, ddS],
		[aa, bb, cc, dd],
		[a, b, c, d]));
	return function(x: number) {
		let _r = res[3];
		let xx = x;
		_r += res[2] * xx;
		xx *= x;
		_r += res[1] * xx;
		xx *= x;
		_r += res[0] * xx;
		return _r;
	}
	
};

function solve4x4(w: number[], x: number[], y: number[], s: number[]) {
	let S, W, X, Y, Z;
	let _S, _W, _X, _Y, _Z;
	const Aa = y[2] - y[3];
	const Ad = w[2] - w[3];
	const Ab = x[2] - x[3];
	const Ah = s[2] - s[3];
	const Ac = x[2] * y[3] - y[2] * x[3];
	const Af = w[2] * y[3] - y[2] * w[3];
	const Ag = w[2] * x[3] - x[2] * w[3];
	const Ai = s[2] * y[3] - y[2] * s[3];
	const Aj = s[2] * x[3] - x[2] * s[3];
	const Ak = w[2] * s[3] - s[2] * w[3];
	const Al = x[2] * s[3] - s[2] * x[3];
	const Am = y[2] * s[3] - s[2] * y[3];

	W = x[1] * Aa - y[1] * Ab + Ac;
	X = w[1] * Aa - y[1] * Ad + Af;
	Y = w[1] * Ab - x[1] * Ad + Ag;
	Z = w[1] * Ac - x[1] * Af + y[1] * Ag;
	_S  = w[0] * W - x[0] * X + y[0] * Y - Z;

	S = x[1] * Aa - y[1] * Ab + Ac;
	X = s[1] * Aa - y[1] * Ah + Ai;
	Y = s[1] * Ab - x[1] * Ah + Aj;
	Z = s[1] * Ac - x[1] * Ai + y[1] * Aj;
	_W = s[0] * S - x[0] * X + y[0] * Y - Z;

	W = s[1] * Aa - y[1] * Ah + Ai;
	S = w[1] * Aa - y[1] * Ad + Af;
	Y = w[1] * Ah - s[1] * Ad + Ak;
	Z = w[1] * Ai - s[1] * Af + y[1] * Ak;
	_X = w[0] * W - s[0] * S + y[0] * Y - Z;

	W = x[1] * Ah - s[1] * Ab + Al;
	X = w[1] * Ah - s[1] * Ad + Ak;
	S = w[1] * Ab - x[1] * Ad + Ag;
	Z = w[1] * Al - x[1] * Ak + s[1] * Ag;
	_Y = w[0] * W - x[0] * X + s[0] * S - Z;

	W = x[1] * Am - y[1] * Al + s[1] * Ac;
	X = w[1] * Am - y[1] * Ak + s[1] * Af;
	Y = w[1] * Al - x[1] * Ak + s[1] * Ag;
	S = w[1] * Ac - x[1] * Af + y[1] * Ag;
	_Z = w[0] * W - x[0] * X + y[0] * Y - s[0] * S;
	return [_W / _S, _X / _S, _Y / _S, _Z / _S];
}

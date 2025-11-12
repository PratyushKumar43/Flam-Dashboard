# Remove Unused Dependencies

## Analysis Results

### ✅ Safe to Remove (Not Used Anywhere)

1. **three** (^0.181.1) - ~600KB
   - ❌ No imports found
   - ❌ Not used in any component

2. **@react-three/fiber** (^9.4.0) - ~200KB
   - ❌ No imports found
   - ❌ Not used in any component

3. **@react-three/drei** (^10.7.6) - ~150KB
   - ❌ No imports found
   - ❌ Not used in any component

**Total Savings: ~950KB**

### ⚠️ Used on Landing Page Only

4. **gsap** (^3.13.0) - ~50KB
   - ✅ Used in `neural-network-hero.tsx`
   - ⚠️ Only used on landing page (`/`), not dashboard
   - **Decision**: Keep for landing page, or remove if landing page not critical

5. **@gsap/react** (^2.1.2) - ~10KB
   - ✅ Used in `neural-network-hero.tsx`
   - ⚠️ Only used on landing page
   - **Decision**: Keep for landing page, or remove if landing page not critical

### ⚠️ Potentially Unused

6. **recharts** (^2.15.4) - ~200KB
   - ⚠️ Found in `chart-area-interactive.tsx` and `chart.tsx`
   - ⚠️ Need to check if these components are used
   - **Action**: Check usage before removing

## Recommended Actions

### Step 1: Remove Definitely Unused Dependencies

```bash
npm uninstall three @react-three/fiber @react-three/drei
```

**Expected Impact:**
- Bundle size reduction: ~950KB
- Performance score: +5-7 points
- Vendor bundle: 357KB → ~250KB

### Step 2: Check recharts Usage

If `chart-area-interactive.tsx` is not used in dashboard:
```bash
npm uninstall recharts
```

**Expected Impact:**
- Bundle size reduction: ~200KB
- Performance score: +2-3 points

### Step 3: Optional - Remove gsap (if landing page not critical)

If the landing page hero animation is not critical:
```bash
npm uninstall gsap @gsap/react
```

Then update `neural-network-hero.tsx` to remove GSAP animations.

**Expected Impact:**
- Bundle size reduction: ~60KB
- Performance score: +1 point

## Total Potential Savings

- **Minimum (Step 1 only)**: ~950KB → Score: 88-90
- **Medium (Step 1 + 2)**: ~1,150KB → Score: 90-92
- **Maximum (All steps)**: ~1,210KB → Score: 91-93

## Next Steps

1. Run Step 1 (remove three.js dependencies)
2. Rebuild and test
3. Check if recharts is used
4. Decide on gsap based on landing page importance


# Cookie Consent & Privacy Policy Implementation Guide

## Files Created

1. **privacy.html** - Complete privacy policy page
2. **privacy.css** - Styling for privacy policy page
3. **cookie-consent.css** - Styling for cookie consent banner
4. **cookie-consent.js** - Functionality for cookie consent banner
5. **footer.css** - Optional footer styling with privacy policy link
6. **index.html** - Updated version with cookie consent banner

## Implementation Steps

### Step 1: Upload Files to Your Repository

Upload these files to your GitHub repository:
- `privacy.html`
- `privacy.css`
- `cookie-consent.css`
- `cookie-consent.js`
- `footer.css` (optional)

### Step 2: Update Your Existing HTML Files

You need to add the cookie consent banner to all your pages. Here's what to add:

#### In the `<head>` section of each page:
```html
<link rel="stylesheet" href="cookie-consent.css">
```

#### Before the closing `</body>` tag of each page:
```html
<!-- Cookie Consent Banner -->
<div id="cookie-consent">
    <div id="cookie-consent-content">
        <div id="cookie-consent-text">
            <h3>🍪 Cookie Notice</h3>
            <p>We use a small cookie to remember your preferences on this site. Our hosting provider (Netlify) may also use essential cookies for website functionality and security. We do not track your browsing activity. By clicking "Accept", you consent to our use of cookies. Learn more in our <a href="privacy.html">Privacy Policy</a>.</p>
        </div>
        <div id="cookie-consent-buttons">
            <button id="cookie-accept" class="cookie-btn">Accept</button>
            <button id="cookie-decline" class="cookie-btn">Decline</button>
        </div>
    </div>
</div>

<script src="cookie-consent.js"></script>
```

#### Files that need updating:
- ✅ `index.html` (already done in the updated version provided)
- `calender.html`
- `contact.html`
- `about.html`

### Step 3: Add Privacy Policy Link to Navigation (Optional)

You can add a link to the privacy policy in your navbar or footer. 

**Option A: Add to existing navbar**
In your `#wrapper` div, add:
```html
<a href="privacy.html"><div id="privacyBtn">Privacy</div></a>
```

**Option B: Add a footer to all pages**
Before the closing `</body>` tag:
```html
<footer id="site-footer">
    <p>
        <a href="privacy.html">Privacy Policy</a> | 
        <a href="contact.html">Contact Us</a>
    </p>
    <p>&copy; 2025 BHS Bell - Barcelona High School</p>
</footer>
```

And include footer.css in your `<head>`:
```html
<link rel="stylesheet" href="footer.css">
```

### Step 4: Update Your Navigation Buttons CSS (if adding to navbar)

If you add a privacy button to the navbar, add this to your CSS files:

```css
#privacyBtn{
    margin: 15px; 
    cursor: pointer;
    transition: font-size 0.5s ease;
}
#privacyBtn:hover{
    font-size: 1.4rem;
}
```

Also update the mobile menu section to include `#privacyBtn`.

### Step 5: GDPR Compliance Checklist for Spain

Since you're based in Spain, here's what you're now compliant with:

✅ **Cookie Notice** - Users are informed about cookies before they're set
✅ **Privacy Policy** - Clear information about data processing
✅ **User Rights** - GDPR rights are outlined in the privacy policy
✅ **Consent Mechanism** - Users can accept or decline cookies
✅ **Third-party Disclosure** - Netlify and GoDaddy are mentioned
✅ **Contact Information** - Users know how to reach you

### Step 6: Test the Implementation

After deploying to Netlify:

1. **Test Cookie Banner:**
   - Visit your site in a new incognito/private window
   - The cookie banner should appear at the bottom
   - Click "Accept" - banner should disappear and not show again
   - Clear cookies/localStorage and click "Decline" - banner should disappear

2. **Test Privacy Policy:**
   - Click the Privacy Policy link in the cookie banner
   - Verify all content displays correctly
   - Check that all external links work

3. **Test on Mobile:**
   - Verify the cookie banner is responsive
   - Check that text is readable on small screens
   - Ensure buttons are easy to tap

### Step 7: Deploy to Netlify

1. Commit all changes to your GitHub repository:
```bash
git add .
git commit -m "Add cookie consent banner and privacy policy"
git push origin main
```

2. Netlify will automatically deploy the changes

3. Verify everything works on the live site

## How the Cookie Consent Works

- **First Visit:** Users see the cookie banner
- **Accept:** Choice is saved in `localStorage`, banner won't show again
- **Decline:** Choice is saved in `localStorage`, banner won't show again
- **No Tracking:** The code doesn't send any data to external services
- **User Control:** Users can clear their browser data to reset their choice

## Customization Options

### Change Banner Colors
Edit `cookie-consent.css`:
```css
#cookie-consent {
    background-color: rgba(40, 40, 40, 0.98); /* Change background */
}

#cookie-accept {
    background-color: #4CAF50; /* Change accept button color */
}
```

### Change Banner Text
Edit the HTML in each file where you add the banner, or edit the text in `privacy.html`.

### Add More Information
Edit `privacy.html` to add sections about:
- Specific courses or features you might add
- Additional third-party services
- Changes to your data practices

## Legal Notes

The privacy policy provided:
- ✅ Complies with GDPR (Spain/EU)
- ✅ Mentions Netlify and GoDaddy data collection
- ✅ Explains user rights
- ✅ Provides contact information
- ✅ Is appropriate for an educational website

**Note:** If you add any new features that collect user data (analytics, forms, accounts, etc.), you MUST update the privacy policy accordingly.

## Need Help?

If you have questions about implementation:
1. Check the browser console for any JavaScript errors
2. Verify all file paths are correct
3. Make sure the files are in the root directory of your site
4. Test in different browsers

## Future Considerations

As your site grows, you may want to:
- Add Google Analytics (requires privacy policy update)
- Add a contact form (requires privacy policy update)
- Add user accounts (requires extensive privacy policy updates)
- Implement a cookie preferences center (more granular control)

Remember: Update your privacy policy whenever you add features that collect data!
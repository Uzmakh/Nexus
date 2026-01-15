# Feature Testing Guide - Nexus Project

## 🚀 Quick Start

1. **Start the development server** (if not already running):
   ```bash
   cd D:\Nexus
   npm run dev
   ```

2. **Open your browser** and navigate to: `http://localhost:5173` (or the port shown in terminal)

3. **Login** with your credentials to access the dashboard

---

## ✅ Features to Test

### 1. Video Calling Feature

**Location:** Sidebar → "Video Call" or Chat page → Video icon

**Test Steps:**
1. Navigate to `/video-call` or click Video Call in sidebar
2. Click "Start Video Call" button
3. **Allow browser permissions** for camera and microphone when prompted
4. Test controls:
   - ✅ **Video Toggle** - Click video button to turn camera on/off
   - ✅ **Audio Toggle** - Click microphone button to mute/unmute
   - ✅ **Screen Share** - Click screen share button (will prompt for screen selection)
   - ✅ **End Call** - Click red phone button to end call
   - ✅ **Fullscreen** - Click maximize button for fullscreen mode

**Expected Behavior:**
- Camera feed appears in local video area
- Video toggle instantly enables/disables camera
- Audio toggle mutes/unmutes microphone
- Screen sharing shows your screen in the main area
- Call duration timer counts up
- Avatar shows when video is disabled

---

### 2. Document Processing Chamber

**Location:** Documents page → "Document Processing Chamber" button

**Test Steps:**

#### A. Upload Documents
1. Navigate to `/documents`
2. Click "Document Processing Chamber" button
3. **Upload a document:**
   - Drag & drop a PDF file onto the upload area, OR
   - Click the upload area to select a file
4. File should appear in the documents list

#### B. Preview Documents
1. Click the **Eye icon** 👁️ on any document
2. Document preview modal opens
3. Test preview controls:
   - ✅ **Zoom In/Out** - Use zoom buttons
   - ✅ **Rotate** - Click rotate button
   - ✅ **Reset** - Click reset to restore default view
   - ✅ **Download** - Click download button
   - ✅ **Close** - Click X to close preview

#### C. Status Management
1. Documents start with **"Draft"** status (gray badge)
2. Click **"Mark for Review"** → Status changes to **"In Review"** (yellow badge)
3. Click **"Sign Document"** → Signature pad opens
4. Draw your signature on the canvas
5. Click **"Save Signature"** → Status changes to **"Signed"** (green badge)

#### D. E-Signature Pad
1. Click **"Sign Document"** on an "In Review" document
2. Signature pad modal opens
3. **Draw signature:**
   - Use mouse to draw on canvas
   - Or use touch if on mobile/tablet
4. Test controls:
   - ✅ **Clear** - Erase signature and start over
   - ✅ **Cancel** - Close without saving
   - ✅ **Save Signature** - Save and update document status

**Expected Behavior:**
- Upload area highlights when dragging files
- Documents appear immediately after upload
- Preview shows PDFs in iframe viewer
- Signature pad captures drawing smoothly
- Status badges update correctly
- Toast notifications appear for actions

---

### 3. Document Chamber Integration

**Location:** Documents page → Document Chamber section

**Test Steps:**
1. Navigate to `/documents`
2. Scroll to "Document Chamber" section
3. See active participants and active document
4. Click **"Open in Chamber"** or **"Document Processing"** buttons
5. Should navigate to Document Processing Chamber page

---

## 🔧 Troubleshooting

### Video/Audio Not Working?
- **Check browser permissions:** Browser should prompt for camera/microphone access
- **HTTPS required:** Some browsers require HTTPS for media access (localhost is OK)
- **Check browser console:** Press F12 → Console tab for errors

### Documents Not Uploading?
- **Check file size:** Maximum 10MB
- **Check file type:** Only PDF, DOC, DOCX, and images supported
- **Check browser console:** Look for error messages

### Signature Pad Not Drawing?
- **Try clicking and dragging:** Make sure to click, hold, and drag
- **Check canvas:** Canvas should be visible and responsive
- **Try clearing:** Click "Clear" button and try again

### Routes Not Working?
- Make sure you're logged in
- Check URL: Should be `/documents/chamber` for Document Chamber
- Check browser console for routing errors

---

## 📋 Feature Checklist

### Video Calling ✅
- [x] Start/End call buttons
- [x] Video toggle (on/off)
- [x] Audio toggle (mute/unmute)
- [x] Screen share functionality
- [x] Call duration timer
- [x] Fullscreen mode
- [x] Participant video grid
- [x] Avatar fallback when video off

### Document Processing Chamber ✅
- [x] Document upload (drag & drop)
- [x] PDF/document preview
- [x] E-signature pad
- [x] Status labels (Draft / In Review / Signed)
- [x] Status workflow management
- [x] Document list with actions
- [x] Download functionality
- [x] Delete functionality

---

## 🎯 Quick Access URLs

- **Documents Page:** `http://localhost:5173/documents`
- **Document Chamber:** `http://localhost:5173/documents/chamber`
- **Video Call:** `http://localhost:5173/video-call`
- **Chat:** `http://localhost:5173/chat`

---

## 💡 Tips

1. **First Time Setup:** Make sure all dependencies are installed:
   ```bash
   npm install
   ```

2. **Browser Compatibility:** 
   - Chrome/Edge: Full support ✅
   - Firefox: Full support ✅
   - Safari: May need HTTPS for media access

3. **Testing Signature:** 
   - Draw slowly for best results
   - Signature saves as image data
   - Can be cleared and redrawn

4. **Document Preview:**
   - PDFs open in iframe
   - Images show directly
   - Other file types show download option

---

## 🐛 Known Issues / Notes

- **Mock Data:** Some documents use mock data (URLs point to '#')
- **Real WebRTC:** Video calling uses real WebRTC but peer connection is mocked (no actual peer-to-peer yet)
- **File Storage:** Uploaded files are stored in browser memory (not persisted to server)
- **Signatures:** Saved as base64 image data (in real app, would be sent to backend)

---

## 📞 Need Help?

If features aren't working:
1. Check browser console (F12)
2. Verify dev server is running
3. Check that you're logged in
4. Try refreshing the page
5. Check network tab for failed requests

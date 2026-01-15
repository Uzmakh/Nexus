# 🚀 Quick Start Guide - Nexus Features

## All Features Are Ready! ✅

### How to Access:

1. **Start the Dev Server** (if not running):
   ```bash
   cd D:\Nexus
   npm run dev
   ```

2. **Open Browser**: Go to `http://localhost:5173` (check terminal for actual port)

3. **Login**: Use your credentials to login

---

## 🎯 Feature Access Points

### 1. Video Calling
**Ways to Access:**
- **Sidebar** → Click "Video Call" menu item
- **Chat Page** → Click video icon (📹) next to any conversation
- **Direct URL**: `http://localhost:5173/video-call`

**What to Test:**
- ✅ Click "Start Video Call" → Allow camera/mic permissions
- ✅ Toggle video button (camera on/off)
- ✅ Toggle audio button (mute/unmute)
- ✅ Click screen share button
- ✅ End call button

---

### 2. Document Processing Chamber
**Ways to Access:**
- **Documents Page** → Click "Document Processing Chamber" button (orange button)
- **Documents Page** → Click "Open in Chamber" on any document
- **Direct URL**: `http://localhost:5173/documents/chamber`

**What to Test:**
- ✅ **Upload**: Drag & drop a PDF file
- ✅ **Preview**: Click eye icon 👁️ on any document
- ✅ **Status**: Change document status (Draft → In Review → Signed)
- ✅ **Sign**: Click "Sign Document" → Draw signature → Save

---

## 🔍 Quick Verification

### Video Calling Works If:
- ✅ Camera feed appears when you start call
- ✅ Video button changes color when toggled
- ✅ Microphone button shows muted state
- ✅ Screen share prompts for screen selection

### Document Chamber Works If:
- ✅ Upload area accepts file drops
- ✅ Documents appear in list after upload
- ✅ Preview opens when clicking eye icon
- ✅ Signature pad opens and allows drawing
- ✅ Status badges change color when updated

---

## ⚠️ Common Issues & Solutions

### "Cannot access camera/microphone"
**Solution:** 
- Click "Allow" when browser prompts for permissions
- Check browser settings → Site permissions → Camera/Microphone

### "Document not uploading"
**Solution:**
- Check file size (max 10MB)
- Check file type (PDF, DOC, DOCX, images only)
- Try clicking upload area instead of drag & drop

### "Signature pad not drawing"
**Solution:**
- Click and hold, then drag (don't just click)
- Try clearing and drawing again
- Make sure canvas area is visible

### "Routes not found"
**Solution:**
- Make sure you're logged in
- Check URL spelling: `/documents/chamber` (not `/document/chamber`)
- Refresh the page

---

## 📱 Testing Checklist

### Video Calling ✅
- [ ] Start call → Camera appears
- [ ] Toggle video → Camera turns off/on
- [ ] Toggle audio → Microphone mutes/unmutes
- [ ] Screen share → Screen selection prompt appears
- [ ] End call → Returns to previous page

### Document Chamber ✅
- [ ] Upload document → File appears in list
- [ ] Preview document → Preview modal opens
- [ ] Change status → Badge updates
- [ ] Sign document → Signature pad opens
- [ ] Draw signature → Signature saves

---

## 🎨 UI Locations

### Navigation:
- **Sidebar** (left side) → All main features listed
- **Top bar** → User info and notifications
- **Documents page** → Multiple buttons to access chamber

### Buttons to Look For:
- 🟠 **"Document Processing Chamber"** → Orange/accent button
- 🔵 **"Start Video Call"** → Blue/secondary button  
- 👁️ **Eye icon** → Preview documents
- ✍️ **"Sign Document"** → Opens signature pad
- 📹 **Video icon** → Start video call from chat

---

## 💡 Pro Tips

1. **First Time:** Browser will ask for camera/mic permissions - click "Allow"
2. **Signature:** Draw slowly for smoother signature capture
3. **Preview:** Use zoom controls to read small text in PDFs
4. **Status:** Documents must be "In Review" before signing

---

## 🆘 Still Having Issues?

1. **Check Browser Console**: Press `F12` → Console tab → Look for red errors
2. **Check Terminal**: Look for errors in the dev server terminal
3. **Refresh Page**: Sometimes a refresh fixes routing issues
4. **Clear Cache**: Try hard refresh (`Ctrl + Shift + R`)

---

## ✅ All Features Status

| Feature | Status | Location |
|---------|--------|----------|
| Video Calling | ✅ Ready | `/video-call` |
| Video Toggle | ✅ Ready | Video call page |
| Audio Toggle | ✅ Ready | Video call page |
| Screen Share | ✅ Ready | Video call page |
| Document Upload | ✅ Ready | `/documents/chamber` |
| Document Preview | ✅ Ready | Document chamber |
| E-Signature | ✅ Ready | Document chamber |
| Status Labels | ✅ Ready | Document chamber |

**Everything is implemented and ready to test!** 🎉

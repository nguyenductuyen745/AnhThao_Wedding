/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Code,
  Download,
  Copy,
  Check,
  Sparkles,
  Heart,
  Users,
  Share2,
  X,
  Sliders,
  MessageSquareHeart,
  HelpCircle,
  FileText,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  FileSpreadsheet,
  Database,
  Send,
  RefreshCw,
  MapPin,
} from 'lucide-react';

interface RSVPItem {
  id: string;
  name: string;
  guestCount: string;
  wishes: string;
  attendance: string;
  createdAt: string;
}

interface ThankYouData {
  open: boolean;
  name: string;
  guestCount?: string;
  attendance?: string;
  wishes?: string;
}

interface WeddingConfig {
  groomName: string;
  brideName: string;
  coupleTitle: string;
  brideParents: string;
  groomParents: string;
  brideAddress: string;
  groomAddress: string;
  partyDate: string;
  partyTime: string;
  ceremonyDate: string;
  ceremonyTime: string;
  venueAddress: string;

  // Bank Info Chú rể
  groomBankOwner: string;
  groomBankNumber: string;
  groomBankName: string;
  groomQrUrl: string;

  // Bank Info Cô dâu
  brideBankOwner: string;
  brideBankNumber: string;
  brideBankName: string;
  brideQrUrl: string;

  // Google Sheets Integration (Tự động đồng bộ form)
  googleSheetUrl: string;

  // Legacy fields
  bankOwner: string;
  bankNumber: string;
  bankName: string;

  musicUrl: string;
  mapsUrl: string;

  // Tiệc Mừng Lễ Cưới: Tư gia nhà trai & nhà gái
  groomPartyAddress?: string;
  groomMapsUrl?: string;
  bridePartyAddress?: string;
  brideMapsUrl?: string;

  // Lời Cảm Ơn Cuối Thiệp
  thankYouTitle?: string;
  thankYouMessage?: string;

  // Cấu hình SEO & Chia Sẻ Mạng Xã Hội (Facebook, Zalo, Instagram, v.v.)
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
}

const DEFAULT_CONFIG: WeddingConfig = {
  groomName: 'Đức Ánh',
  brideName: 'Phương Thảo',
  coupleTitle: 'Nguyễn Phương Thảo & Nguyễn Đức Ánh',
  brideParents: 'BỐ: Nguyễn Trọng Nghị<br>MẸ: Hà Thị Thúy',
  groomParents: 'BỐ: Nguyễn Đức Hợp<br>MẸ: Nguyễn Thị Chầm',
  brideAddress: 'Thôn Tích Giang 1, Xã Phúc Thọ, TP Hà Nội',
  groomAddress: 'Thôn Canh Nậu 2, Tây Phương, Hà Nội',
  partyDate: 'Chủ Nhật 15. 11. 2026 (Tức Ngày 07 Tháng 10 Năm Bính Ngọ)',
  partyTime: '15:30',
  ceremonyDate: 'Thứ Hai 16. 11. 2026 (Tức Ngày 08 Tháng 10 Năm Bính Ngọ)',
  ceremonyTime: '13:30 - Thứ Hai',
  venueAddress: 'Sn 4, Xóm Dốc Ao Thuyền, Thôn Canh Nậu 2, Tây Phương, Hà Nội',

  // Tiệc mừng: Nhà trai & Nhà gái
  groomPartyAddress: 'Sn 4, Xóm Dốc Ao Thuyền,\nThôn Canh Nậu 2, Tây Phương, Hà Nội',
  groomMapsUrl: 'https://maps.app.goo.gl/d4oj1nqgekesFoYG6?g_st=iz',
  bridePartyAddress: 'Thôn Tích Giang 1, Xã Phúc Thọ, TP Hà Nội',
  brideMapsUrl: 'https://maps.app.goo.gl/4vXb8imUK9uh2Qmu9?g_st=iz',

  // Lời cảm ơn cuối thiệp (Thank You)
  thankYouTitle: 'Thank You',
  thankYouMessage:
    'Từ tận đáy lòng, chúng mình cảm ơn bạn đã dành tình cảm và sự hiện diện cho ngày vui này. Chính bạn đã góp phần làm nên một kỷ niệm hạnh phúc mà chúng mình sẽ luôn trân trọng.',

  // Chú Rể: Vietinbank
  groomBankOwner: 'NGUYEN DUC ANH',
  groomBankNumber: '100870535710',
  groomBankName: 'Vietinbank',
  groomQrUrl: 'https://img.vietqr.io/image/ICB-100870535710-compact2.png?amount=0&addInfo=Mung%20cuoi%20chu%20re%20Duc%20Anh&accountName=NGUYEN%20DUC%20ANH',

  // Cô Dâu: MB bank
  brideBankOwner: 'NGUYEN PHUONG THAO',
  brideBankNumber: '0349168992',
  brideBankName: 'MB bank',
  brideQrUrl: 'https://img.vietqr.io/image/MB-0349168992-compact2.png?amount=0&addInfo=Mung%20cuoi%20co%20dau%20Phuong%20Thao&accountName=NGUYEN%20PHUONG%20THAO',

  // SEO & Social Sharing
  seoTitle: 'Thư Mời Lễ Cưới – Đức Ánh & Phương Thảo',
  seoDescription: 'Trân trọng kính mời quý khách tới tham dự Lễ Thành Hôn của Đức Ánh & Phương Thảo vào ngày 15-16 tháng 11 năm 2026. Sự hiện diện và lời chúc phúc của bạn là niềm vinh dự cho gia đình chúng tôi!',
  seoImage: '/images/MB_03648.jpg',

  // Google Sheets
  googleSheetUrl:
    (import.meta as any).env?.VITE_GOOGLE_SHEETS_SCRIPT_URL ||
    'https://script.google.com/macros/s/AKfycbwE_tPtNLaw_2fQgYW59izqTCcyt9mfqReKru89A3zRjph13eyNu015H3TbEP8KMCIAuQ/exec',

  // Legacy
  bankOwner: 'NGUYEN PHUONG THAO',
  bankNumber: '0349168992',
  bankName: 'MB bank',

  musicUrl: 'https://cdn.jsdelivr.net/gh/saygoodbyethe3-bit/music-hosting/50%20N%C4%83m%20V%E1%BB%81%20Sau.mp3',
  mapsUrl: 'https://maps.app.goo.gl/d4oj1nqgekesFoYG6?g_st=iz',
};

export default function App() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'download' | 'customizer' | 'rsvps' | 'code' | 'guide'>('download');
  const [copiedCode, setCopiedCode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // RSVP submissions stored in localStorage
  const [rsvps, setRsvps] = useState<RSVPItem[]>(() => {
    try {
      const saved = localStorage.getItem('wedding_rsvps');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: '1',
        name: 'Nguyễn Văn Tuấn',
        guestCount: '2',
        wishes: 'Chúc hai bạn trăm năm hạnh phúc, đầu bạc răng long, mãi mãi yêu thương nhau!',
        attendance: 'Có, mình sẽ đến',
        createdAt: 'Hôm nay, 10:30',
      },
      {
        id: '2',
        name: 'Trần Thị Mai',
        guestCount: '1',
        wishes: 'Chúc mừng hạnh phúc cô dâu chú rể nhé!',
        attendance: 'Có, mình sẽ đến',
        createdAt: 'Hôm nay, 09:15',
      },
    ];
  });

  // Thank You modal after submitting RSVP
  const [thankYouModal, setThankYouModal] = useState<ThankYouData | null>(null);

  // Customizer state
  const [config, setConfig] = useState<WeddingConfig>(() => {
    try {
      const saved = localStorage.getItem('wedding_custom_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.groomName && parsed.groomName !== 'Văn Thái') {
          return {
            ...DEFAULT_CONFIG,
            ...parsed,
            googleSheetUrl: parsed.googleSheetUrl || DEFAULT_CONFIG.googleSheetUrl,
          };
        }
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_CONFIG;
  });

  // Test personalized guest name
  const [testGuestName, setTestGuestName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  // Google Sheets state
  const [isTestingSheet, setIsTestingSheet] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [showScriptModal, setShowScriptModal] = useState(false);

  // Toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Google Apps Script source code template for auto syncing
  const GOOGLE_APPS_SCRIPT_CODE = `/**
 * GOOGLE APPS SCRIPT CHO THIỆP CƯỚI ONLINE
 * Tự động đồng bộ form "GỬI XÁC NHẬN" vào Google Sheets
 * Tên trang tính đích: "Xác nhận tham dự"
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = "Xác nhận tham dự";
    var sheet = ss.getSheetByName(sheetName);

    // Tự động tạo trang tính nếu chưa tồn tại
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow([
        "Thời Gian Gửi",
        "Họ và Tên",
        "Số Lượng Khách",
        "Xác Nhận Tham Dự",
        "Lời Chúc Mừng"
      ]);
      var headerRange = sheet.getRange(1, 1, 1, 5);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#8B1E24");
      headerRange.setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }

    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    // safeCell: Xử lý an toàn ký tự và phòng tránh formula injection
    function safeCell(val) {
      if (val === null || val === undefined) return "";
      var str = String(val).trim();
      if (/^[=\\+\\-@]/.test(str)) {
        return "'" + str;
      }
      return str;
    }

    var now = new Date();
    var timeZone = Session.getScriptTimeZone() || "Asia/Ho_Chi_Minh";
    var timestamp = Utilities.formatDate(now, timeZone, "dd/MM/yyyy HH:mm:ss");

    var name = safeCell(data.hoTen || data.name || data.form_item13 || data.guestName || "Khách mời");
    var count = safeCell(data.soLuong || data.guestCount || data.form_item14 || data.count || "1");
    var attendance = safeCell(data.thamDu || data.attendance || data.form_item17 || "Có, mình sẽ đến");
    var wishes = safeCell(data.loiChuc || data.wishes || data.form_item15 || data.message || "");

    sheet.appendRow([timestamp, name, count, attendance, wishes]);

    return ContentService.createTextOutput(JSON.stringify({
      result: "success",
      status: 200,
      message: "Đã ghi nhận thành công vào Google Sheets"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      result: "error",
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    message: "Google Apps Script Wedding RSVP Endpoint đang hoạt động."
  })).setMimeType(ContentService.MimeType.JSON);
}
`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE).then(() => {
      setCopiedScript(true);
      showToast('✓ Đã sao chép mã Google Apps Script vào clipboard!');
      setTimeout(() => setCopiedScript(false), 3000);
    });
  };

  const handleTestGoogleSheet = async () => {
    const url = config.googleSheetUrl || (import.meta as any).env?.VITE_GOOGLE_SHEETS_SCRIPT_URL;
    if (!url || !url.trim().startsWith('http')) {
      showToast('⚠️ Vui lòng nhập URL Web App Google Apps Script trước!');
      return;
    }
    setIsTestingSheet(true);
    try {
      const testPayload = {
        // Vietnamese keys for Google Apps Script
        hoTen: 'Khách Thử Nghiệm',
        soLuong: 2,
        thamDu: 'Có, mình sẽ đến',
        loiChuc: 'Chúc mừng hai bạn trăm năm hạnh phúc! (Kiểm tra kết nối Google Sheets)',
        // English keys
        name: 'Khách Thử Nghiệm',
        guestName: 'Khách Thử Nghiệm',
        guestCount: '2',
        count: '2',
        wishes: 'Chúc mừng hai bạn trăm năm hạnh phúc! (Kiểm tra kết nối Google Sheets)',
        attendance: 'Có, mình sẽ đến',
        // Form items
        form_item13: 'Khách Thử Nghiệm',
        form_item14: '2',
        form_item15: 'Chúc mừng hai bạn trăm năm hạnh phúc! (Kiểm tra kết nối Google Sheets)',
        form_item17: 'Có, mình sẽ đến',
        createdAt: new Date().toISOString(),
      };
      await fetch(url.trim(), {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(testPayload),
      });
      showToast('✓ Đã gửi dữ liệu thử nghiệm! Hãy kiểm tra sheet "Xác nhận tham dự" trên Google Drive của bạn.');
    } catch (err: any) {
      console.error(err);
      showToast('⚠️ Có lỗi xảy ra khi gửi thử nghiệm. Hãy kiểm tra URL Web App.');
    } finally {
      setIsTestingSheet(false);
    }
  };

  useEffect(() => {
    // Check if user requested admin/source modal via URL query param ?code=true or ?admin=true
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('code') === 'true' || params.get('admin') === 'true') {
        setIsOpenModal(true);
      }
    } catch (e) {
      console.error(e);
    }

    // Keyboard shortcut to open source modal: Ctrl + Shift + S
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        setIsOpenModal((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Safeguard for mobile devices: Ensure all elements are visible and never blank
    const revealAllAnimatedElements = () => {
      document.querySelectorAll('.ladi-animation-hidden').forEach((el) => {
        el.classList.remove('ladi-animation-hidden');
        (el as HTMLElement).style.setProperty('visibility', 'visible', 'important');
        (el as HTMLElement).style.setProperty('opacity', '1', 'important');
        (el as HTMLElement).style.setProperty('pointer-events', 'auto', 'important');
      });
    };
    revealAllAnimatedElements();
    window.addEventListener('scroll', revealAllAnimatedElements, { passive: true });
    window.addEventListener('touchmove', revealAllAnimatedElements, { passive: true });
    const revealInterval = setInterval(revealAllAnimatedElements, 300);
    const clearTimer = setTimeout(() => clearInterval(revealInterval), 4000);

    // Auto-scale mobile invitation to fit any mobile device screen (360px, 375px, 390px, 412px, etc.)
    const handleResponsiveLayout = () => {
      const clientW = document.documentElement.clientWidth || window.innerWidth || screen.width;
      const wraper = document.querySelector('.ladi-wraper') as HTMLElement;
      if (!wraper) return;
      if (clientW < 424 && clientW > 0) {
        // Subtract 2px margin to ensure the right border is never clipped by scrollbars or fractional subpixel rendering
        const ratio = Math.min(1, (clientW - 2) / 420);
        wraper.style.setProperty('zoom', String(ratio));
        wraper.style.setProperty('width', '420px', 'important');
        wraper.style.setProperty('max-width', 'none', 'important');
        wraper.style.setProperty('margin', '0 auto', 'important');
        wraper.style.setProperty('box-shadow', 'none', 'important');
      } else {
        wraper.style.removeProperty('zoom');
        wraper.style.setProperty('width', '420px', 'important');
        wraper.style.setProperty('max-width', '420px', 'important');
        wraper.style.setProperty('margin', '0 auto', 'important');
        wraper.style.setProperty('box-shadow', '0 10px 40px rgba(0, 0, 0, 0.12)', 'important');
      }
    };
    handleResponsiveLayout();
    window.addEventListener('resize', handleResponsiveLayout, { passive: true });
    window.addEventListener('orientationchange', handleResponsiveLayout, { passive: true });

    // Tự động kiểm tra và đồng bộ ảnh từ thư mục images theo sheet data thật
    const applyRealImagesFromFolder = () => {
      const photoMap: Record<string, { file: string; pos?: string }> = {
        IMAGE3: { file: 'MB_03648', pos: 'center 20%' },  // Ảnh bìa chính đầu thiệp
        IMAGE16: { file: 'MB_03617', pos: 'center center' }, // Ảnh thiệp mời (ảnh ngang - Trân Trọng Kính Mời)
        IMAGE79: { file: 'MB_03048', pos: 'center 20%' }, // Ảnh kỷ niệm 1
        IMAGE80: { file: 'MB_03263', pos: 'center 20%' }, // Ảnh kỷ niệm 2
        IMAGE81: { file: 'MB_03230', pos: 'center 20%' }, // Ảnh kỷ niệm 3
        IMAGE44: { file: 'MB_03629', pos: 'center 20%' }, // Album ảnh cưới 1
        IMAGE45: { file: 'MB_03456', pos: 'center 20%' }, // Album ảnh cưới 2
        IMAGE43: { file: 'MB_03275', pos: 'center 20%' }, // Album ảnh cưới 3
        IMAGE46: { file: 'MB_03720', pos: 'center 20%' }, // Album ảnh cưới 4
        IMAGE47: { file: 'MB_03474', pos: 'center 20%' }, // Album ảnh cưới 5
        IMAGE48: { file: 'MB_03013', pos: 'center 20%' }, // Album ảnh cưới 6
        IMAGE51: { file: 'MB_03595', pos: 'center 20%' }, // Album ảnh cưới 7
        IMAGE52: { file: 'MB_03698', pos: 'center 20%' }, // Album ảnh cưới 8
        IMAGE49: { file: 'MB_03069', pos: 'center 20%' }, // Album ảnh cưới 9
        IMAGE50: { file: 'MB_03414', pos: 'center 20%' }, // Album ảnh cưới 10
        IMAGE59: { file: 'MB_03670', pos: 'center 15%' }, // Ảnh Cảm ơn chân trang (Thank You) - IMAGE59, KHÔNG chạm vào IMAGE60!
      };

      Object.entries(photoMap).forEach(([elId, item]) => {
        const el = document.getElementById(elId);
        if (!el) return;
        const bgEl = el.querySelector('.ladi-image-background') as HTMLElement;
        if (!bgEl) return;

        bgEl.style.setProperty('background-image', `url('/images/${item.file}.jpg')`, 'important');
        bgEl.style.setProperty('background-size', 'cover', 'important');
        bgEl.style.setProperty('background-repeat', 'no-repeat', 'important');
        bgEl.style.setProperty('background-position', item.pos || 'center center', 'important');
        bgEl.style.setProperty('width', '100%', 'important');
        bgEl.style.setProperty('height', '100%', 'important');
        bgEl.style.setProperty('top', '0px', 'important');
        bgEl.style.setProperty('left', '0px', 'important');
      });
    };
    applyRealImagesFromFolder();

    // Synchronize animation on Groom and Bride direction buttons
    const syncDirectionButtonsAnimation = () => {
      const groomBtn = document.getElementById('BUTTON10_GROOM');
      const brideBtn = document.getElementById('BUTTON10');
      if (groomBtn && !groomBtn.classList.contains('ladi-animation')) {
        groomBtn.classList.add('ladi-animation');
      }
      if (brideBtn && !brideBtn.classList.contains('ladi-animation')) {
        brideBtn.classList.add('ladi-animation');
      }
    };
    syncDirectionButtonsAnimation();

    // Default autoplay background music on initial entrance and interaction fallback
    const ensureMusicAutoplay = () => {
      const audio = document.getElementById('myAudio') as HTMLAudioElement;
      const toggleBtn = document.getElementById('toggleMusic');
      const icon = document.getElementById('musicIcon') as HTMLImageElement;
      const iconPlay = 'https://img.icons8.com/ios-filled/50/ffffff/musical-notes.png';

      if (audio && audio.paused) {
        audio.play().then(() => {
          if (icon) {
            icon.src = iconPlay;
            icon.classList.add('rotating');
          }
          if (toggleBtn) toggleBtn.classList.add('rippling');
        }).catch(() => {
          // Browser autoplay policy will allow on first user interaction
        });
      }
    };
    ensureMusicAutoplay();
    ['click', 'touchstart', 'scroll', 'pointerdown'].forEach((evt) => {
      window.addEventListener(evt, ensureMusicAutoplay, { once: true, passive: true });
    });

    // 1. Check guest name from URL parameter ?Ten=
    try {
      const params = new URLSearchParams(window.location.search);
      const guest = params.get('Ten');
      if (guest) {
        const decoded = decodeURIComponent(guest).trim();
        const headline732 = document.getElementById('HEADLINE732');
        if (headline732) headline732.textContent = decoded;
      }
    } catch (e) {
      console.error(e);
    }

    // 2. Gift Box Popup & Backdrop management:
    // DO NOT attach duplicate click on GROUP22 - let LadiPage handle opening POPUP2 natively!
    // We attach thorough, foolproof close handlers so overlay is NEVER stuck!
    const closeGiftModal = (e?: Event) => {
      if (e) {
        try {
          e.stopPropagation();
          e.preventDefault();
        } catch (_) {}
      }

      // Remove ANY and ALL style_popup tags injected by LadiPage
      const stylePopup = document.getElementById('style_popup');
      if (stylePopup) {
        stylePopup.remove();
      }
      document.querySelectorAll('style').forEach((s) => {
        if (s.id === 'style_popup' || (s.innerHTML && s.innerHTML.includes('#backdrop-popup') && s.innerHTML.includes('!important'))) {
          s.remove();
        }
      });

      // Force-hide backdrop-popup completely
      const backdrop = document.getElementById('backdrop-popup');
      if (backdrop) {
        backdrop.style.setProperty('display', 'none', 'important');
        backdrop.style.removeProperty('background-color');
        backdrop.style.removeProperty('opacity');
        backdrop.classList.add('hidden');
      }

      // Force-hide POPUP2
      const popup2 = document.getElementById('POPUP2');
      if (popup2) {
        popup2.style.setProperty('display', 'none', 'important');
        popup2.removeAttribute('data-popup-backdrop');
        popup2.removeAttribute('data-scroll');
        popup2.classList.remove('ladi-animation');
      }

      // Notify LadiPage runtime
      try {
        if ((window as any).ladi && typeof (window as any).ladi === 'function') {
          (window as any).ladi('POPUP2').hide();
        }
      } catch (_) {}
      try {
        if ((window as any).LadiPageScript && typeof (window as any).LadiPageScript.runRemovePopup === 'function') {
          (window as any).LadiPageScript.runRemovePopup('POPUP2', true);
        }
      } catch (_) {}

      // Unfreeze body position
      document.body.style.removeProperty('position');
      document.body.style.removeProperty('top');
      document.body.style.removeProperty('width');
      document.body.style.removeProperty('overflow');
    };

    // Global capture-phase listener: intercepts clicks on .popup-close, .ladi-overlay, or #backdrop-popup
    const handleGlobalClickCapture = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (
        target.classList.contains('popup-close') ||
        target.closest('.popup-close') ||
        target.classList.contains('ladi-overlay') ||
        target.id === 'backdrop-popup'
      ) {
        closeGiftModal(e);
      }
    };

    document.addEventListener('click', handleGlobalClickCapture, true);
    document.addEventListener('touchend', handleGlobalClickCapture, true);

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeGiftModal(e);
        setThankYouModal(null);
      }
    };
    window.addEventListener('keydown', handleEscapeKey);

    // 3. Setup Copy STK Buttons for both Groom & Bride

    // Copy Groom STK
    const btnCopyGroom = document.getElementById('BTN_COPY_GROOM_STK');
    const handleCopyGroom = (e: Event) => {
      e.stopPropagation();
      e.preventDefault();
      const stk = config.groomBankNumber || '19036789999';
      const ctk = config.groomBankOwner || 'HOÀNG VĂN PHÁT';
      const nn = config.groomBankName || 'Techcombank';
      navigator.clipboard.writeText(stk).then(() => {
        showToast(`✓ Đã sao chép STK Chú rể: ${stk} (${nn} - ${ctk})`);
      });
    };
    if (btnCopyGroom) btnCopyGroom.addEventListener('click', handleCopyGroom);

    // Copy Bride STK
    const btnCopyBride = document.getElementById('BTN_COPY_BRIDE_STK');
    const oldGroup87 = document.getElementById('GROUP87');
    const oldHeadline93 = document.getElementById('HEADLINE93');
    const handleCopyBride = (e: Event) => {
      e.stopPropagation();
      e.preventDefault();
      const stk = config.brideBankNumber || config.bankNumber || '8993979999';
      const ctk = config.brideBankOwner || config.bankOwner || 'BÙI THỊ HỒNG HẠNH';
      const nn = config.brideBankName || config.bankName || 'Techcombank';
      navigator.clipboard.writeText(stk).then(() => {
        showToast(`✓ Đã sao chép STK Cô dâu: ${stk} (${nn} - ${ctk})`);
      });
    };
    if (btnCopyBride) btnCopyBride.addEventListener('click', handleCopyBride);
    if (oldGroup87) oldGroup87.addEventListener('click', handleCopyBride);
    if (oldHeadline93) oldHeadline93.addEventListener('click', handleCopyBride);

    // 4. Intercept RSVP Form Submission
    const formElement = document.querySelector('form.ladi-form') as HTMLFormElement;
    const btnSubmit = document.getElementById('BUTTON13');
    let isSubmitting = false;

    if (formElement) {
      formElement.setAttribute('onsubmit', 'return false;');
      formElement.onsubmit = (e) => {
        e.preventDefault();
        return false;
      };
    }

    const handleFormSubmit = (e: Event) => {
      if (e) {
        try {
          e.preventDefault();
          e.stopPropagation();
        } catch (_) {}
      }

      if (isSubmitting) return;
      isSubmitting = true;
      setTimeout(() => {
        isSubmitting = false;
      }, 2500);

      const nameInput = document.querySelector('input[name="form_item13"]') as HTMLInputElement;
      const countInput = document.querySelector('input[name="form_item14"]') as HTMLInputElement;
      const wishInput = document.querySelector('input[name="form_item15"]') as HTMLInputElement;
      const selectAttendance = document.querySelector('select[name="form_item17"]') as HTMLSelectElement;

      const guestName = nameInput?.value?.trim() || 'Bạn bè & Người thân';

      // Smart extraction of guest count from user input:
      // Handles: "2", "2 người", "đi 2 người", "2 bạn", "3", "4 người", etc.
      let finalCount = 1;
      const rawCount = countInput?.value?.trim() || '';
      const digitMatch = rawCount.match(/\d+/);
      if (digitMatch) {
        finalCount = parseInt(digitMatch[0], 10);
      } else if (rawCount) {
        if (/hai|2|đôi|cả hai|vợ chồng/i.test(rawCount)) finalCount = 2;
        else if (/ba|3/i.test(rawCount)) finalCount = 3;
        else if (/bốn|4/i.test(rawCount)) finalCount = 4;
        else finalCount = 1;
      }

      const countStr = String(finalCount);
      const wish = wishInput?.value?.trim() || 'Chúc mừng hai bạn trăm năm hạnh phúc!';
      const attendance = selectAttendance?.value || 'Có, mình sẽ đến';

      const newRsvp: RSVPItem = {
        id: Date.now().toString(),
        name: guestName,
        guestCount: countStr,
        wishes: wish,
        attendance: attendance,
        createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };

      setRsvps((prev) => {
        const updated = [newRsvp, ...prev];
        localStorage.setItem('wedding_rsvps', JSON.stringify(updated));
        return updated;
      });

      // Clear input values
      if (nameInput) nameInput.value = '';
      if (countInput) countInput.value = '';
      if (wishInput) wishInput.value = '';
      if (selectAttendance) selectAttendance.value = '';

      // Hide any LadiPage backdrops or overlays so our modal is never covered
      try {
        const backdrops = document.querySelectorAll('.backdrop-popup, #backdrop-popup, .ladi-overlay');
        backdrops.forEach((el) => {
          (el as HTMLElement).style.display = 'none';
        });
      } catch (_) {}

      // Open celebration modal with full details
      setThankYouModal({
        open: true,
        name: guestName,
        guestCount: countStr,
        attendance: attendance,
        wishes: wish,
      });

      // 5. Tự động đồng bộ lên Google Sheets nếu đã cấu hình
      const targetScriptUrl = config.googleSheetUrl || (import.meta as any).env?.VITE_GOOGLE_SHEETS_SCRIPT_URL;
      if (targetScriptUrl && targetScriptUrl.trim().startsWith('http')) {
        try {
          const payload = {
            // Vietnamese keys for Google Apps Script (All variants for "Số người"!)
            hoTen: guestName,
            soNguoi: finalCount,
            so_nguoi: finalCount,
            songuoi: finalCount,
            "Số người": finalCount,
            "Số Người": finalCount,
            "Số lượng": finalCount,
            "Số Lượng Khách": finalCount,
            soLuong: finalCount,
            so_luong: finalCount,
            soluong: finalCount,
            count: finalCount,
            guestCount: countStr,
            form_item14: countStr,

            // Attendance
            thamDu: attendance,
            trangThai: attendance,
            trang_thai: attendance,
            trangThaiThamDu: attendance,
            "Trạng thái tham dự": attendance,
            "Xác Nhận Tham Dự": attendance,
            attendance: attendance,
            form_item17: attendance,

            // Wishes
            loiChuc: wish,
            loi_chuc: wish,
            loichuc: wish,
            "Lời chúc": wish,
            "Lời Chúc": wish,
            "Lời Chúc Mừng": wish,
            wishes: wish,
            message: wish,
            form_item15: wish,

            // General
            name: guestName,
            guestName: guestName,
            form_item13: guestName,
            createdAt: new Date().toISOString(),
          };

          fetch(targetScriptUrl.trim(), {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify(payload),
          })
            .then(() => {
              showToast('✓ Lời chúc đã được gửi & tự động đồng bộ lên Google Sheets!');
            })
            .catch((err) => {
              console.warn('Google Sheets sync warning:', err);
            });
        } catch (err) {
          console.error('Google Sheets fetch error:', err);
        }
      }
    };

    if (formElement) {
      formElement.addEventListener('submit', handleFormSubmit, true);
    }
    if (btnSubmit) {
      btnSubmit.addEventListener('click', handleFormSubmit, true);
      btnSubmit.style.cursor = 'pointer';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('click', handleGlobalClickCapture, true);
      window.removeEventListener('scroll', revealAllAnimatedElements);
      window.removeEventListener('touchmove', revealAllAnimatedElements);
      clearInterval(revealInterval);
      clearTimeout(clearTimer);
      if (btnCopyGroom) btnCopyGroom.removeEventListener('click', handleCopyGroom);
      if (btnCopyBride) btnCopyBride.removeEventListener('click', handleCopyBride);
      if (oldGroup87) oldGroup87.removeEventListener('click', handleCopyBride);
      if (oldHeadline93) oldHeadline93.removeEventListener('click', handleCopyBride);
      if (formElement) formElement.removeEventListener('submit', handleFormSubmit, true);
      if (btnSubmit) btnSubmit.removeEventListener('click', handleFormSubmit, true);
    };
  }, [config]);

  // Apply custom config to DOM in real-time
  const applyConfigToDOM = (newConfig: WeddingConfig) => {
    try {
      document.querySelectorAll('.ladi-animation-hidden').forEach((el) => {
        el.classList.remove('ladi-animation-hidden');
        (el as HTMLElement).style.setProperty('visibility', 'visible', 'important');
        (el as HTMLElement).style.setProperty('opacity', '1', 'important');
        (el as HTMLElement).style.setProperty('pointer-events', 'auto', 'important');
      });
      const h3 = document.querySelector('#HEADLINE3 .ladi-headline');
      if (h3) h3.innerHTML = `${newConfig.groomName} &amp; ${newConfig.brideName}`;

      const h4 = document.querySelector('#HEADLINE4 .ladi-headline');
      if (h4) h4.textContent = newConfig.coupleTitle;

      const pBrideParents7 = document.querySelector('#PARAGRAPH7 .ladi-paragraph');
      if (pBrideParents7) pBrideParents7.innerHTML = '';

      const pBrideParents8 = document.querySelector('#PARAGRAPH8 .ladi-paragraph');
      if (pBrideParents8) pBrideParents8.innerHTML = newConfig.brideParents;

      const pGroomParents = document.querySelector('#PARAGRAPH9 .ladi-paragraph');
      if (pGroomParents) pGroomParents.innerHTML = newConfig.groomParents;

      const pBrideAddr = document.querySelector('#PARAGRAPH6 .ladi-paragraph');
      if (pBrideAddr) pBrideAddr.textContent = newConfig.brideAddress;

      const pGroomAddr = document.querySelector('#PARAGRAPH10 .ladi-paragraph');
      if (pGroomAddr) pGroomAddr.textContent = newConfig.groomAddress;

      // Update Tiệc Mừng Lễ Cưới: Tư Gia Nhà Trai & Tư Gia Nhà Gái
      const pPartyGroom = document.querySelector('#PARAGRAPH245_GROOM .ladi-paragraph');
      if (pPartyGroom) {
        const groomAddr = newConfig.groomPartyAddress || newConfig.groomAddress || 'Sn 4, Xóm Dốc Ao Thuyền,\nThôn Canh Nậu 2, Tây Phương, Hà Nội';
        pPartyGroom.innerHTML = groomAddr.replace(/\n/g, '<br>');
      }

      const btnGroomMaps = document.getElementById('BUTTON10_GROOM') as HTMLAnchorElement;
      if (btnGroomMaps) {
        btnGroomMaps.href = newConfig.groomMapsUrl || newConfig.mapsUrl || 'https://maps.app.goo.gl/d4oj1nqgekesFoYG6?g_st=iz';
      }

      const pPartyBride = document.querySelector('#PARAGRAPH245 .ladi-paragraph');
      if (pPartyBride) {
        const brideAddr = newConfig.bridePartyAddress || 'Thôn Tích Giang 1, Xã Phúc Thọ, TP Hà Nội';
        pPartyBride.innerHTML = brideAddr.replace(/\n/g, '<br>');
      }

      const btnBrideMaps = document.getElementById('BUTTON10') as HTMLAnchorElement;
      if (btnBrideMaps) {
        btnBrideMaps.href = newConfig.brideMapsUrl || newConfig.mapsUrl || 'https://maps.app.goo.gl/4vXb8imUK9uh2Qmu9?g_st=iz';
      }

      // Update Dates across the invitation card
      const pSaveDate = document.querySelector('#PARAGRAPH2 .ladi-paragraph');
      if (pSaveDate) pSaveDate.textContent = '16. 11 . 2026';

      const p248 = document.querySelector('#PARAGRAPH248 .ladi-paragraph');
      if (p248) p248.textContent = '15';

      const p249 = document.querySelector('#PARAGRAPH249 .ladi-paragraph');
      if (p249) p249.textContent = '11';

      const p250 = document.querySelector('#PARAGRAPH250 .ladi-paragraph');
      if (p250) p250.textContent = '2026';

      const p229 = document.querySelector('#PARAGRAPH229 .ladi-paragraph');
      if (p229) p229.innerHTML = '15:30 - Chủ Nhật<br>';

      const p230 = document.querySelector('#PARAGRAPH230 .ladi-paragraph');
      if (p230) p230.innerHTML = '15. 11. 2026<br>';

      const p231 = document.querySelector('#PARAGRAPH231 .ladi-paragraph');
      if (p231) p231.textContent = '( Tức Ngày 07 Tháng 10 Năm Bính Ngọ )';

      const p260 = document.querySelector('#PARAGRAPH260 .ladi-paragraph');
      if (p260) p260.innerHTML = '13:30 - Thứ Hai<br>';

      const p261 = document.querySelector('#PARAGRAPH261 .ladi-paragraph');
      if (p261) p261.innerHTML = '16. 11. 2026<br>';

      const p262 = document.querySelector('#PARAGRAPH262 .ladi-paragraph');
      if (p262) p262.textContent = '( Tức Ngày 08 Tháng 10 Năm Bính Ngọ )';

      const p263 = document.querySelector('#PARAGRAPH263 .ladi-paragraph');
      if (p263) p263.innerHTML = 'TƯ GIA NHÀ TRAI<br>';

      const pCalMonth = document.querySelector('#PARAGRAPH12 .ladi-paragraph');
      if (pCalMonth) pCalMonth.textContent = 'Tháng 11 - 2026';

      // Cập nhật thứ trong tuần (Tháng 11/2026: Ngày 1 là Chủ Nhật - CN)
      const hlMap: { [key: string]: string } = {
        HEADLINE47: 'CN<br>',
        HEADLINE48: 'T2<br>',
        HEADLINE49: 'T3<br>',
        HEADLINE50: 'T4<br>',
        HEADLINE51: 'T5<br>',
        HEADLINE52: 'T6<br>',
        HEADLINE53: 'T7<br>',
      };
      Object.entries(hlMap).forEach(([id, text]) => {
        const el = document.querySelector(`#${id} .ladi-headline`);
        if (el) el.innerHTML = text;
      });

      // Định vị trái tim đỏ Save The Date vào đúng ngày 16.11.2026 (Thứ Hai - Col T2, Hàng 3)
      const imgHeart = document.getElementById('IMAGE69');
      if (imgHeart) {
        imgHeart.style.setProperty('top', '128px', 'important');
        imgHeart.style.setProperty('left', '48.6px', 'important');
      }

      // Update Groom bank info in POPUP2
      const elGroomCtk = document.getElementById('GIFT_GROOM_CTK');
      if (elGroomCtk) elGroomCtk.textContent = `CTK: ${newConfig.groomBankOwner}`;

      const elGroomStk = document.getElementById('GIFT_GROOM_STK');
      if (elGroomStk) elGroomStk.textContent = `STK: ${newConfig.groomBankNumber}`;

      const elGroomNn = document.getElementById('GIFT_GROOM_NN');
      if (elGroomNn) elGroomNn.textContent = `NN: ${newConfig.groomBankName}`;

      const elGroomQr = document.getElementById('GIFT_GROOM_QR_IMG') as HTMLImageElement;
      if (elGroomQr && newConfig.groomQrUrl) elGroomQr.src = newConfig.groomQrUrl;

      // Update Bride bank info in POPUP2
      const elBrideCtk = document.getElementById('GIFT_BRIDE_CTK') || document.getElementById('HEADLINE91');
      if (elBrideCtk) {
        const span = elBrideCtk.querySelector('.ladi-headline') || elBrideCtk;
        span.textContent = `CTK: ${newConfig.brideBankOwner || newConfig.bankOwner}`;
      }

      const elBrideStk = document.getElementById('GIFT_BRIDE_STK') || document.getElementById('HEADLINE92');
      if (elBrideStk) {
        const span = elBrideStk.querySelector('.ladi-headline') || elBrideStk;
        span.textContent = `STK: ${newConfig.brideBankNumber || newConfig.bankNumber}`;
      }

      const elBrideNn = document.getElementById('GIFT_BRIDE_NN') || document.getElementById('HEADLINE94');
      if (elBrideNn) {
        const span = elBrideNn.querySelector('.ladi-headline') || elBrideNn;
        span.textContent = `NN: ${newConfig.brideBankName || newConfig.bankName}`;
      }

      const elBrideQr = (document.getElementById('GIFT_BRIDE_QR_IMG') || document.getElementById('IMAGE90')) as HTMLImageElement;
      if (elBrideQr && newConfig.brideQrUrl) elBrideQr.src = newConfig.brideQrUrl;

      const audioEl = document.getElementById('myAudio') as HTMLAudioElement;
      if (audioEl && newConfig.musicUrl) {
        audioEl.src = newConfig.musicUrl;
      }

      // Update Lời Cảm Ơn Cuối Thiệp (Thank You section)
      const pThankYouTitle = document.querySelector('#PARAGRAPH48 .ladi-paragraph');
      if (pThankYouTitle) {
        pThankYouTitle.textContent = newConfig.thankYouTitle || DEFAULT_CONFIG.thankYouTitle || 'Thank You';
      }

      const pThankYouMessage = document.querySelector('#PARAGRAPH49 .ladi-paragraph');
      if (pThankYouMessage) {
        const msg = newConfig.thankYouMessage || DEFAULT_CONFIG.thankYouMessage || 'Từ tận đáy lòng, chúng mình cảm ơn bạn đã dành tình cảm và sự hiện diện cho ngày vui này. Chính bạn đã góp phần làm nên một kỷ niệm hạnh phúc mà chúng mình sẽ luôn trân trọng.';
        pThankYouMessage.innerHTML = msg.replace(/\n/g, '<br>');
      }

      // Update SEO & Social sharing meta tags (Facebook, Zalo, Instagram, iMessage)
      const currentTitle = newConfig.seoTitle || `Thư Mời Lễ Cưới – ${newConfig.groomName} & ${newConfig.brideName}`;
      document.title = currentTitle;

      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', newConfig.seoDescription || DEFAULT_CONFIG.seoDescription!);

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', currentTitle);

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', newConfig.seoDescription || DEFAULT_CONFIG.seoDescription!);

      const ogImg = document.querySelector('meta[property="og:image"]');
      if (ogImg && newConfig.seoImage) ogImg.setAttribute('content', newConfig.seoImage);

      const ogImgSec = document.querySelector('meta[property="og:image:secure_url"]');
      if (ogImgSec && newConfig.seoImage) ogImgSec.setAttribute('content', newConfig.seoImage);

      const twTitle = document.querySelector('meta[name="twitter:title"]');
      if (twTitle) twTitle.setAttribute('content', currentTitle);

      const twDesc = document.querySelector('meta[name="twitter:description"]');
      if (twDesc) twDesc.setAttribute('content', newConfig.seoDescription || DEFAULT_CONFIG.seoDescription!);

      const twImg = document.querySelector('meta[name="twitter:image"]');
      if (twImg && newConfig.seoImage) twImg.setAttribute('content', newConfig.seoImage);

      localStorage.setItem('wedding_custom_config', JSON.stringify(newConfig));
      showToast('✓ Đã cập nhật thông tin lên thiệp cưới thành công!');
    } catch (e) {
      console.error('Error applying config', e);
    }
  };

  // Generate personalized guest link
  const handleGenerateLink = (name: string) => {
    if (!name.trim()) return;
    const url = new URL(window.location.href);
    url.searchParams.set('Ten', name.trim());
    setGeneratedLink(url.toString());

    const headline732 = document.getElementById('HEADLINE732');
    if (headline732) headline732.textContent = name.trim();
  };

  // Single-file HTML code for downloading & copying
  const [rawHtmlCode, setRawHtmlCode] = useState('');
  useEffect(() => {
    fetch('/thiepso01-standalone.html')
      .then((res) => res.text())
      .then((txt) => setRawHtmlCode(txt))
      .catch((err) => console.error(err));
  }, []);

  const handleCopyCode = () => {
    if (!rawHtmlCode) return;
    navigator.clipboard.writeText(rawHtmlCode).then(() => {
      setCopiedCode(true);
      showToast('✓ Đã sao chép toàn bộ mã nguồn HTML vào clipboard!');
      setTimeout(() => setCopiedCode(false), 2500);
    });
  };

  const handleDownloadHtml = () => {
    let outputHtml = rawHtmlCode;
    if (config !== DEFAULT_CONFIG) {
      outputHtml = outputHtml
        .replace(/Văn Thái &amp; Thùy Trang/g, `${config.groomName} &amp; ${config.brideName}`)
        .replace(/Hoàng Thanh Huế &amp; Hoàng Văn Phát/g, config.coupleTitle)
        .replace(/HOÀNG VĂN PHÁT/g, config.groomBankOwner)
        .replace(/19036789999/g, config.groomBankNumber)
        .replace(/BUI THI HONG HANH/g, config.brideBankOwner)
        .replace(/BÙI THỊ HỒNG HẠNH/g, config.brideBankOwner)
        .replace(/8993979999/g, config.brideBankNumber);

      if (config.groomPartyAddress) {
        outputHtml = outputHtml.replace(
          'Bản Chẹn, xã Tạ Khoa, tỉnh Sơn La',
          config.groomPartyAddress.replace(/\n/g, '<br>')
        );
      }
      if (config.groomMapsUrl) {
        outputHtml = outputHtml.replace(
          /id="BUTTON10_GROOM"[^>]*class=['"][^'"]*['"]/g,
          `id="BUTTON10_GROOM" class='ladi-element ladi-animation'`
        ).replace(
          /id="BUTTON10_GROOM"[^>]*href=['"][^'"]*['"]/g,
          `id="BUTTON10_GROOM" href="${config.groomMapsUrl}"`
        );
      }
      if (config.brideMapsUrl) {
        outputHtml = outputHtml.replace(
          /id="BUTTON10"[^>]*class=['"][^'"]*['"]/g,
          `id="BUTTON10" class='ladi-element ladi-animation'`
        ).replace(
          /id="BUTTON10"[^>]*href=['"][^'"]*['"]/g,
          `id="BUTTON10" href="${config.brideMapsUrl}"`
        );
      }

      const finalTitle = config.seoTitle || `Thư Mời Lễ Cưới – ${config.groomName} &amp; ${config.brideName}`;
      outputHtml = outputHtml
        .replace(/<title>.*?<\/title>/g, `<title>${finalTitle}</title>`)
        .replace(/content="Thư Mời Lễ Cưới – Văn Thái &amp; Thùy Trang"/g, `content="${finalTitle}"`);

      if (config.seoDescription) {
        outputHtml = outputHtml
          .replace(
            /content="Trân trọng kính mời quý khách tới tham dự Lễ Thành Hôn của Văn Thái &amp; Thùy Trang vào ngày 03-04 tháng 10 năm 2026. Sự hiện diện và lời chúc phúc của bạn là niềm vinh dự cho gia đình chúng tôi!"/g,
            `content="${config.seoDescription}"`
          );
      }

      if (config.seoImage) {
        outputHtml = outputHtml
          .replace(
            /https:\/\/w\.ladicdn\.com\/s650x800\/644bd195fdccd700206206ea\/imgi_25_cb4e0638acc8d-20251117034834-f4jjx-20260504073647-zjmsk\.jpg/g,
            config.seoImage
          );
      }
    }

    if (config.googleSheetUrl) {
      outputHtml = outputHtml.replace(
        /__GOOGLE_SHEETS_URL__/g,
        config.googleSheetUrl.trim()
      );
    }

    const blob = new Blob([outputHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'thiep-cuoi-lovecard-thiepso01.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('✓ Đã bắt đầu tải file: thiep-cuoi-lovecard-thiepso01.html');
  };

  const exportRsvpsToCSV = () => {
    if (rsvps.length === 0) {
      showToast('Chưa có lời chúc nào để xuất!');
      return;
    }
    const headers = ['Họ và Tên', 'Số người đi cùng', 'Trạng thái tham dự', 'Lời chúc', 'Thời gian'];
    const rows = rsvps.map((r) => [
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.guestCount}"`,
      `"${r.attendance}"`,
      `"${r.wishes.replace(/"/g, '""')}"`,
      `"${r.createdAt}"`,
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'danh-sach-khach-mung-cuoi.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('✓ Đã xuất danh sách lời chúc ra file CSV!');
  };

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[99999999] bg-stone-900/95 backdrop-blur-md text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 text-sm font-medium border border-stone-700 animate-in fade-in slide-in-from-top duration-300">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-spin" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Thank You Celebration Modal - Giao diện cảm ơn trang trọng theo chuẩn thiệp cưới */}
      {thankYouModal?.open && (
        <div
          id="wedding-thankyou-modal"
          onClick={() => setThankYouModal(null)}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Nút đóng X góc trên */}
            <button
              onClick={() => setThankYouModal(null)}
              className="close-btn"
              aria-label="Đóng"
            >
              ✕
            </button>

            {/* Icon Trái tim song hỷ trang trọng */}
            <div className="heart-crest">
              <Heart className="w-8 h-8 fill-amber-300 text-amber-300 animate-pulse" />
            </div>

            {/* Tiêu đề & Cặp đôi */}
            <div className="title-badge">
              THƯ CẢM ƠN
            </div>
            <h3 className="main-title">
              Lời Cảm Ơn Chân Thành!
            </h3>
            <p className="couple-subtitle">
              {config.groomName} &amp; {config.brideName} trân trọng cảm ơn
            </p>

            {/* Tên khách & Lời ghi nhận */}
            <div className="info-card">
              <div className="info-row">
                <span className="info-label">Khách mời:</span>
                <span className="guest-name-val">{thankYouModal.name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Xác nhận:</span>
                <span
                  className={`status-badge ${
                    thankYouModal.attendance?.includes('Có') ? 'yes' : 'no'
                  }`}
                >
                  {thankYouModal.attendance?.includes('Có') ? '✓ ' : '✕ '}
                  {thankYouModal.attendance || 'Có, mình sẽ đến'} ({thankYouModal.guestCount || '1'} người)
                </span>
              </div>
              {thankYouModal.wishes && (
                <div className="wishes-box">
                  "{thankYouModal.wishes}"
                </div>
              )}
            </div>

            {/* Thông điệp tri ân ấm áp */}
            <p className="thank-quote">
              "Tình cảm, lời chúc phúc và sự hiện diện của bạn là niềm hạnh phúc lớn lao, là món quà quý giá nhất trong ngày trọng đại của chúng mình!"
            </p>

            {/* Nút đóng hoàn tất */}
            <button
              onClick={() => setThankYouModal(null)}
              className="btn-confirm"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Quay Lại Thiệp Cưới</span>
            </button>
          </div>
        </div>
      )}

      {/* Source Code & Customizer Modal (Opened via ?admin=true, ?code=true or Ctrl+Shift+S) */}
      {isOpenModal && (
        <div className="fixed inset-0 z-[99999999] bg-black/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6">
          <div className="bg-stone-900 border border-stone-800 text-stone-100 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-700 to-amber-600 flex items-center justify-center text-white shadow-md">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Thiệp Cưới Online #01 - Source Code Trọn Gói
                  </h2>
                  <p className="text-xs text-stone-400">
                    Thiệp cưới điện tử hiện đại kèm nhạc nền lãng mạn
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpenModal(false)}
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-stone-800 bg-stone-950/40 px-6 gap-2 overflow-x-auto text-xs sm:text-sm font-medium scrollbar-none">
              <button
                onClick={() => setActiveTab('download')}
                className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'download'
                    ? 'border-amber-400 text-amber-300 font-semibold'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>Tải Source &amp; Copy</span>
              </button>
              <button
                onClick={() => setActiveTab('customizer')}
                className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'customizer'
                    ? 'border-amber-400 text-amber-300 font-semibold'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Tùy Chỉnh Thiệp</span>
              </button>
              <button
                onClick={() => setActiveTab('rsvps')}
                className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'rsvps'
                    ? 'border-amber-400 text-amber-300 font-semibold'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <MessageSquareHeart className="w-4 h-4" />
                <span>Khách &amp; Lời Chúc ({rsvps.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'code'
                    ? 'border-amber-400 text-amber-300 font-semibold'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <Code className="w-4 h-4" />
                <span>Xem Mã Nguồn</span>
              </button>
              <button
                onClick={() => setActiveTab('guide')}
                className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'guide'
                    ? 'border-amber-400 text-amber-300 font-semibold'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Hướng Dẫn Đưa Lên Mạng</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: DOWNLOAD & COPY */}
              {activeTab === 'download' && (
                <div className="space-y-6">
                  {/* Highlights Banner */}
                  <div className="bg-gradient-to-r from-red-950/60 via-stone-900 to-amber-950/60 border border-amber-500/20 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                        Chuẩn Bản Gốc &amp; SEO
                      </span>
                      <h3 className="text-lg font-bold text-white mt-2">
                        Tải Trọn Gói File HTML Độc Lập
                      </h3>
                      <p className="text-xs text-stone-300 max-w-xl mt-1 leading-relaxed">
                        File HTML chứa toàn bộ mã nguồn, hình ảnh sắc nét, font chữ Google Fonts, bài hát MP3, hiệu ứng tuyết rơi &amp; trái tim bay, popup mừng cưới chuẩn mẫu gốc, chuẩn SEO thẻ chia sẻ link Facebook, Zalo!
                      </p>
                    </div>
                    <div className="flex flex-wrap sm:flex-nowrap gap-2.5 w-full md:w-auto">
                      <button
                        onClick={handleDownloadHtml}
                        className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-stone-950 font-bold px-5 py-3 rounded-xl shadow-lg hover:shadow-amber-500/20 active:scale-95 transition-all text-sm cursor-pointer whitespace-nowrap"
                      >
                        <Download className="w-4 h-4" />
                        <span>Tải file index.html</span>
                      </button>
                      <button
                        onClick={handleCopyCode}
                        className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-700 text-white font-medium px-4 py-3 rounded-xl border border-stone-700 active:scale-95 transition-all text-sm cursor-pointer whitespace-nowrap"
                      >
                        {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedCode ? 'Đã sao chép!' : 'Copy Code'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="bg-stone-950/60 border border-stone-800/80 rounded-2xl p-4 flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold text-white">Chữ &amp; Bố Cục Chuẩn 100%</h4>
                        <p className="text-xs text-stone-400 mt-0.5">
                          Đầy đủ thông tin gia đình 2 bên, ngày giờ tiệc mừng &amp; thành hôn, rạp cưới, lịch cưới tháng 10.
                        </p>
                      </div>
                    </div>
                    <div className="bg-stone-950/60 border border-stone-800/80 rounded-2xl p-4 flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold text-white">Hộp Mừng Cưới Chuẩn Web Mẫu</h4>
                        <p className="text-xs text-stone-400 mt-0.5">
                          Giao diện phong bao thiệp mừng Techcombank gốc, CTK BUI THI HONG HANH, STK 8993979999, nút Copy STK.
                        </p>
                      </div>
                    </div>
                    <div className="bg-stone-950/60 border border-stone-800/80 rounded-2xl p-4 flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold text-white">SEO &amp; Card Chia Sẻ Link</h4>
                        <p className="text-xs text-stone-400 mt-0.5">
                          Tích hợp OpenGraph &amp; Twitter Card, hiện ảnh đại diện cưới, tiêu đề và mô tả chuẩn đẹp khi gửi link qua Zalo/Facebook.
                        </p>
                      </div>
                    </div>
                    <div className="bg-stone-950/60 border border-stone-800/80 rounded-2xl p-4 flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold text-white">Nhạc Nền &amp; Nút Xoay Đĩa</h4>
                        <p className="text-xs text-stone-400 mt-0.5">
                          Bài hát "50 Năm Về Sau.mp3", tự động phát khi chạm, nút bật/tắt hiệu ứng sóng âm &amp; xoay tròn.
                        </p>
                      </div>
                    </div>
                    <div className="bg-stone-950/60 border border-stone-800/80 rounded-2xl p-4 flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold text-white">Tuyết Rơi &amp; Trái Tim Bay</h4>
                        <p className="text-xs text-stone-400 mt-0.5">
                          Hiệu ứng animation lãng mạn nhẹ nhàng bay khắp màn hình bằng CSS3 Keyframes tối ưu 60 FPS.
                        </p>
                      </div>
                    </div>
                    <div className="bg-stone-950/60 border border-stone-800/80 rounded-2xl p-4 flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold text-white">Cá Nhân Hóa Tên Khách ?Ten=</h4>
                        <p className="text-xs text-stone-400 mt-0.5">
                          Tự động nhận diện tham số link: <code>?Ten=Anh+Nam</code> sẽ hiện "Kính mời: Anh Nam".
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Fast Personalized Link Generator */}
                  <div className="bg-stone-950/80 border border-stone-800 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-amber-400" />
                      <h4 className="text-sm font-bold text-white">
                        Tạo Nhanh Link Thiệp Mời Cá Nhân Hóa Từng Khách (Gửi Zalo / Messenger)
                      </h4>
                    </div>
                    <p className="text-xs text-stone-400">
                      Nhập tên khách mời bên dưới, hệ thống sẽ tự sinh đường link riêng để gửi cho khách. Khi khách mở link, thiệp sẽ ghi đích danh tên họ:
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        placeholder="Ví dụ: Anh Tuấn & Chị Linh, Bạn Hoàng, Bác Ba..."
                        value={testGuestName}
                        onChange={(e) => {
                          setTestGuestName(e.target.value);
                          handleGenerateLink(e.target.value);
                        }}
                        className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                      <button
                        onClick={() => {
                          if (!testGuestName) return;
                          navigator.clipboard.writeText(generatedLink).then(() => {
                            showToast(`✓ Đã copy link thiệp mời cho: ${testGuestName}`);
                          });
                        }}
                        disabled={!testGuestName}
                        className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 font-bold px-4 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Copy Link Gửi Khách</span>
                      </button>
                    </div>
                    {generatedLink && (
                      <div className="text-xs text-amber-300 font-mono bg-stone-900/90 p-2.5 rounded-lg break-all border border-stone-800">
                        {generatedLink}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: LIVE CUSTOMIZER */}
              {activeTab === 'customizer' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Tùy Chỉnh Thông Tin Cô Dâu, Chú Rể &amp; Ngân Hàng
                      </h3>
                      <p className="text-xs text-stone-400">
                        Nhập thông tin thực tế của bạn, bấm "Áp Dụng" để cập nhật ngay lập tức lên giao diện thiệp cưới.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setConfig(DEFAULT_CONFIG);
                        applyConfigToDOM(DEFAULT_CONFIG);
                      }}
                      className="text-xs text-stone-400 hover:text-white underline cursor-pointer"
                    >
                      Khôi phục mặc định mẫu
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Chú Rể & Cô Dâu */}
                    <div className="bg-stone-950/60 border border-stone-800 rounded-2xl p-4 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                        <Users className="w-3.5 h-3.5" />
                        1. Tên Cô Dâu &amp; Chú Rể
                      </h4>
                      <div>
                        <label className="text-xs text-stone-400">Tên Chú Rể</label>
                        <input
                          type="text"
                          value={config.groomName}
                          onChange={(e) => setConfig({ ...config, groomName: e.target.value })}
                          className="w-full mt-1 bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-stone-400">Tên Cô Dâu</label>
                        <input
                          type="text"
                          value={config.brideName}
                          onChange={(e) => setConfig({ ...config, brideName: e.target.value })}
                          className="w-full mt-1 bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-stone-400">Dòng Tiêu Đề Cặp Đôi (Header)</label>
                        <input
                          type="text"
                          value={config.coupleTitle}
                          onChange={(e) => setConfig({ ...config, coupleTitle: e.target.value })}
                          className="w-full mt-1 bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    {/* Gia Đình 2 Bên */}
                    <div className="bg-stone-950/60 border border-stone-800 rounded-2xl p-4 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                        <Heart className="w-3.5 h-3.5" />
                        2. Cha Mẹ &amp; Địa Chỉ Hai Nhà
                      </h4>
                      <div>
                        <label className="text-xs text-stone-400">Bố Mẹ Nhà Gái</label>
                        <input
                          type="text"
                          value={config.brideParents}
                          onChange={(e) => setConfig({ ...config, brideParents: e.target.value })}
                          className="w-full mt-1 bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-stone-400">Địa Chỉ Nhà Gái</label>
                        <input
                          type="text"
                          value={config.brideAddress}
                          onChange={(e) => setConfig({ ...config, brideAddress: e.target.value })}
                          className="w-full mt-1 bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-stone-400">Bố Mẹ Nhà Trai</label>
                        <input
                          type="text"
                          value={config.groomParents}
                          onChange={(e) => setConfig({ ...config, groomParents: e.target.value })}
                          className="w-full mt-1 bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-stone-400">Địa Chỉ Nhà Trai</label>
                        <input
                          type="text"
                          value={config.groomAddress}
                          onChange={(e) => setConfig({ ...config, groomAddress: e.target.value })}
                          className="w-full mt-1 bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    {/* Tiệc Mừng Lễ Cưới: Tư Gia Nhà Trai & Tư Gia Nhà Gái */}
                    <div className="bg-stone-950/60 border border-amber-500/30 rounded-2xl p-4 space-y-4 md:col-span-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5" />
                          Tiệc Mừng Lễ Cưới (Tư Gia Nhà Trai &amp; Tư Gia Nhà Gái)
                        </h4>
                        <span className="text-[11px] text-stone-400">Hiển thị trực tiếp trong khung TIỆC MỪNG LỄ CƯỚI</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Tư Gia Nhà Trai */}
                        <div className="bg-stone-900/50 border border-blue-500/20 rounded-xl p-3.5 space-y-2.5">
                          <div className="text-xs font-semibold text-blue-400 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                            TƯ GIA NHÀ TRAI (Ở TRÊN)
                          </div>
                          <div>
                            <label className="text-[11px] text-stone-400">Địa chỉ đón tiếp (Tư gia nhà trai)</label>
                            <textarea
                              rows={2}
                              value={config.groomPartyAddress || ''}
                              onChange={(e) => setConfig({ ...config, groomPartyAddress: e.target.value })}
                              className="w-full mt-1 bg-stone-950 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
                              placeholder="Bản Chẹn, xã Tạ Khoa, tỉnh Sơn La"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-stone-400">Link Google Maps (Chỉ đường Nhà Trai)</label>
                            <input
                              type="text"
                              value={config.groomMapsUrl || ''}
                              onChange={(e) => setConfig({ ...config, groomMapsUrl: e.target.value })}
                              className="w-full mt-1 bg-stone-950 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                              placeholder="https://maps.app.goo.gl/..."
                            />
                          </div>
                        </div>

                        {/* Tư Gia Nhà Gái */}
                        <div className="bg-stone-900/50 border border-rose-500/20 rounded-xl p-3.5 space-y-2.5">
                          <div className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                            TƯ GIA NHÀ GÁI (Ở DƯỚI)
                          </div>
                          <div>
                            <label className="text-[11px] text-stone-400">Địa chỉ đón tiếp (Tư gia nhà gái)</label>
                            <textarea
                              rows={2}
                              value={config.bridePartyAddress || ''}
                              onChange={(e) => setConfig({ ...config, bridePartyAddress: e.target.value })}
                              className="w-full mt-1 bg-stone-950 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500 resize-none"
                              placeholder="Tam Tân, Tân An, TP Hải Phòng..."
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-stone-400">Link Google Maps (Chỉ đường Nhà Gái)</label>
                            <input
                              type="text"
                              value={config.brideMapsUrl || ''}
                              onChange={(e) => setConfig({ ...config, brideMapsUrl: e.target.value })}
                              className="w-full mt-1 bg-stone-950 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500"
                              placeholder="https://maps.app.goo.gl/..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mừng Cưới Chú Rể */}
                    <div className="bg-stone-950/60 border border-blue-500/30 rounded-2xl p-4 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                        <CreditCard className="w-3.5 h-3.5" />
                        3. Mừng Cưới BÊN CHÚ RỂ (QR &amp; Tài Khoản)
                      </h4>
                      <div>
                        <label className="text-xs text-stone-400">Chủ Tài Khoản (CTK) Chú Rể</label>
                        <input
                          type="text"
                          value={config.groomBankOwner}
                          onChange={(e) => setConfig({ ...config, groomBankOwner: e.target.value })}
                          className="w-full mt-1 bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-stone-400">Số Tài Khoản (STK) Chú Rể</label>
                        <input
                          type="text"
                          value={config.groomBankNumber}
                          onChange={(e) => setConfig({ ...config, groomBankNumber: e.target.value })}
                          className="w-full mt-1 bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-stone-400">Tên Ngân Hàng (NN) Chú Rể</label>
                        <input
                          type="text"
                          value={config.groomBankName}
                          onChange={(e) => setConfig({ ...config, groomBankName: e.target.value })}
                          className="w-full mt-1 bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-stone-400">Link Ảnh QR Chú Rể</label>
                        <input
                          type="text"
                          value={config.groomQrUrl}
                          onChange={(e) => setConfig({ ...config, groomQrUrl: e.target.value })}
                          className="w-full mt-1 bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Mừng Cưới Cô Dâu */}
                    <div className="bg-stone-950/60 border border-rose-500/30 rounded-2xl p-4 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                        <CreditCard className="w-3.5 h-3.5" />
                        4. Mừng Cưới BÊN CÔ DÂU (QR &amp; Tài Khoản)
                      </h4>
                      <div>
                        <label className="text-xs text-stone-400">Chủ Tài Khoản (CTK) Cô Dâu</label>
                        <input
                          type="text"
                          value={config.brideBankOwner}
                          onChange={(e) => setConfig({ ...config, brideBankOwner: e.target.value, bankOwner: e.target.value })}
                          className="w-full mt-1 bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-stone-400">Số Tài Khoản (STK) Cô Dâu</label>
                        <input
                          type="text"
                          value={config.brideBankNumber}
                          onChange={(e) => setConfig({ ...config, brideBankNumber: e.target.value, bankNumber: e.target.value })}
                          className="w-full mt-1 bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-stone-400">Tên Ngân Hàng (NN) Cô Dâu</label>
                        <input
                          type="text"
                          value={config.brideBankName}
                          onChange={(e) => setConfig({ ...config, brideBankName: e.target.value, bankName: e.target.value })}
                          className="w-full mt-1 bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-stone-400">Link Ảnh QR Cô Dâu</label>
                        <input
                          type="text"
                          value={config.brideQrUrl}
                          onChange={(e) => setConfig({ ...config, brideQrUrl: e.target.value })}
                          className="w-full mt-1 bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                        />
                      </div>
                    </div>

                    {/* Nhạc nền */}
                    <div className="bg-stone-950/60 border border-stone-800 rounded-2xl p-4 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        5. Nhạc Nền MP3
                      </h4>
                      <div>
                        <label className="text-xs text-stone-400">Đường dẫn file MP3 trực tiếp</label>
                        <input
                          type="text"
                          value={config.musicUrl}
                          onChange={(e) => setConfig({ ...config, musicUrl: e.target.value })}
                          className="w-full mt-1 bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <p className="text-xs text-stone-400">Mặc định: "50 Năm Về Sau.mp3".</p>
                    </div>

                    {/* Lời Cảm Ơn Cuối Thiệp (Thank You) */}
                    <div className="bg-stone-950/60 border border-stone-800 rounded-2xl p-4 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                        <Heart className="w-3.5 h-3.5" />
                        6. Lời Cảm Ơn Cuối Thiệp (Thank You)
                      </h4>
                      <div>
                        <label className="text-xs text-stone-400">Tiêu đề cảm ơn</label>
                        <input
                          type="text"
                          value={config.thankYouTitle || ''}
                          onChange={(e) => setConfig({ ...config, thankYouTitle: e.target.value })}
                          className="w-full mt-1 bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                          placeholder="Thank You"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-stone-400">Nội dung cảm ơn chân thành</label>
                        <textarea
                          rows={3}
                          value={config.thankYouMessage || ''}
                          onChange={(e) => setConfig({ ...config, thankYouMessage: e.target.value })}
                          className="w-full mt-1 bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 resize-none"
                          placeholder="Từ tận đáy lòng, chúng mình cảm ơn bạn đã dành tình cảm và sự hiện diện cho ngày vui này..."
                        />
                      </div>
                    </div>

                    {/* Google Sheets Integration */}
                    <div className="md:col-span-2 bg-gradient-to-r from-emerald-950/40 via-stone-950/70 to-teal-950/40 border border-emerald-500/30 rounded-2xl p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                            <FileSpreadsheet className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                              <span>7. Đồng Bộ Google Sheets (Tự Động Lưu Khách Mời &amp; Lời Chúc)</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                                config.googleSheetUrl
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                  : 'bg-stone-800 text-stone-400 border-stone-700'
                              }`}>
                                {config.googleSheetUrl ? 'Đã cấu hình' : 'Chưa nhập URL'}
                              </span>
                            </h4>
                            <p className="text-xs text-stone-300">
                              Mỗi khi khách gửi form, dữ liệu sẽ tự động được ghi thành 1 dòng mới vào bảng tính Google Sheets của bạn.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <button
                            type="button"
                            onClick={() => setShowScriptModal(true)}
                            className="text-xs bg-stone-800 hover:bg-stone-700 text-emerald-300 hover:text-white px-3 py-1.5 rounded-xl border border-stone-700 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                          >
                            <Code className="w-3.5 h-3.5" />
                            <span>Mã Apps Script &amp; Hướng Dẫn</span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs text-stone-300 font-medium flex items-center justify-between">
                          <span>URL Web App Google Apps Script</span>
                          <span className="text-[11px] text-stone-400">Định dạng: https://script.google.com/macros/s/.../exec</span>
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                            value={config.googleSheetUrl}
                            onChange={(e) => setConfig({ ...config, googleSheetUrl: e.target.value })}
                            className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                          />
                          <button
                            type="button"
                            onClick={handleTestGoogleSheet}
                            disabled={isTestingSheet || !config.googleSheetUrl}
                            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-800 disabled:text-stone-500 text-white font-medium px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                          >
                            {isTestingSheet ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Send className="w-3.5 h-3.5" />
                            )}
                            <span>{isTestingSheet ? 'Đang gửi...' : 'Thử Gửi Test'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="bg-stone-900/80 rounded-xl p-3 border border-stone-800/80 text-[11px] text-stone-400 space-y-1">
                        <p className="font-semibold text-stone-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Dữ liệu sẽ được tự động lưu vào trang tính: <span className="text-emerald-300 font-mono font-bold">"Xác nhận tham dự"</span></span>
                        </p>
                        <p className="leading-relaxed">
                          Bao gồm 5 cột: <strong>Thời Gian Gửi</strong>, <strong>Họ và Tên</strong>, <strong>Số Lượng Khách</strong>, <strong>Xác Nhận Tham Dự</strong>, <strong>Lời Chúc Mừng</strong>.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={() => applyConfigToDOM(config)}
                      className="flex-1 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-stone-950 font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Áp Dụng Thông Tin Lên Thiệp Ngay</span>
                    </button>
                    <button
                      onClick={handleDownloadHtml}
                      className="bg-stone-800 hover:bg-stone-700 text-white font-medium py-3 px-5 rounded-xl border border-stone-700 active:scale-95 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Tải HTML Đã Tùy Chỉnh</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: GUESTBOOK & RSVP LIST */}
              {activeTab === 'rsvps' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Danh Sách Lời Chúc &amp; Khách Xác Nhận Tham Dự
                      </h3>
                      <p className="text-xs text-stone-400">
                        Dữ liệu được thu thập trực tiếp khi khách điền form "GỬI XÁC NHẬN" trên thiệp cưới.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={exportRsvpsToCSV}
                        className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Xuất CSV (Excel)</span>
                      </button>
                    </div>
                  </div>

                  {/* Google Sheets Sync Status Bar */}
                  <div
                    className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      config.googleSheetUrl
                        ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                        : 'bg-stone-950/60 border-stone-800 text-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          config.googleSheetUrl
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-stone-800 text-stone-400'
                        }`}
                      >
                        <FileSpreadsheet className="w-5 h-5" />
                      </div>
                      <div className="text-xs">
                        <div className="font-bold flex items-center gap-2">
                          <span>
                            {config.googleSheetUrl
                              ? 'Tự Động Đồng Bộ Google Sheets: ĐANG BẬT'
                              : 'Google Sheets: Chưa Cấu Hình'}
                          </span>
                          {config.googleSheetUrl && (
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          {config.googleSheetUrl
                            ? 'Mỗi lượt gửi form sẽ được lưu trực tiếp vào Google Sheets trên Drive của bạn.'
                            : 'Bạn có thể nhập link Google Apps Script trong tab "Tùy Chỉnh Thiệp" để lưu dữ liệu vào Google Sheets.'}
                        </p>
                      </div>
                    </div>
                    {config.googleSheetUrl ? (
                      <button
                        onClick={handleTestGoogleSheet}
                        disabled={isTestingSheet}
                        className="text-xs bg-emerald-700/60 hover:bg-emerald-600 text-white font-medium px-3.5 py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap self-start sm:self-auto"
                      >
                        {isTestingSheet ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                        <span>Gửi Dòng Thử Nghiệm</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveTab('customizer')}
                        className="text-xs bg-stone-800 hover:bg-stone-700 text-amber-300 font-medium px-3 py-1.5 rounded-xl border border-stone-700 transition-colors cursor-pointer self-start sm:self-auto"
                      >
                        Thiết Lập Ngay &rarr;
                      </button>
                    )}
                  </div>

                  {rsvps.length === 0 ? (
                    <div className="text-center py-12 text-stone-400 text-sm bg-stone-950/40 rounded-2xl border border-stone-800">
                      Chưa có lời chúc nào. Hãy thử điền form trên thiệp cưới để xem dữ liệu xuất hiện tại đây!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {rsvps.map((r) => (
                        <div
                          key={r.id}
                          className="bg-stone-950/70 border border-stone-800/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">{r.name}</span>
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                  r.attendance.includes('Có')
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                }`}
                              >
                                {r.attendance}
                              </span>
                              <span className="text-[11px] text-stone-400 bg-stone-900 px-2 py-0.5 rounded-full border border-stone-800">
                                Đi {r.guestCount} người
                              </span>
                            </div>
                            <p className="text-xs text-stone-300 italic">"{r.wishes}"</p>
                          </div>
                          <div className="text-[11px] text-stone-500 whitespace-nowrap self-end sm:self-auto">
                            {r.createdAt}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: CODE VIEWER */}
              {activeTab === 'code' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">Xem Trước Mã Nguồn Single-file HTML</h3>
                      <p className="text-xs text-stone-400">
                        Tập tin <code>thiep-cuoi-lovecard-thiepso01.html</code> (188 KB) bao gồm toàn bộ CSS, JS, HTML không cần cài đặt.
                      </p>
                    </div>
                    <button
                      onClick={handleCopyCode}
                      className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedCode ? 'Đã Copy!' : 'Copy Code'}</span>
                    </button>
                  </div>

                  <div className="bg-stone-950 border border-stone-800 rounded-2xl p-4 font-mono text-xs text-stone-300 max-h-96 overflow-y-auto scrollbar-thin">
                    <pre className="whitespace-pre-wrap break-all">
                      {rawHtmlCode ? rawHtmlCode.substring(0, 15000) + '\n\n... [Còn 170KB mã nguồn nữa - Hãy bấm Copy Code hoặc Tải file HTML để lấy trọn vẹn] ...' : 'Đang nạp mã nguồn...'}
                    </pre>
                  </div>
                </div>
              )}

              {/* TAB 5: DEPLOYMENT GUIDE */}
              {activeTab === 'guide' && (
                <div className="space-y-5 text-sm">
                  <div className="bg-stone-950/60 border border-stone-800 rounded-2xl p-5 space-y-3">
                    <h4 className="font-bold text-amber-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Cách 1: Đưa lên Vercel / Netlify (Miễn phí 100% - Mất 30 giây)
                    </h4>
                    <ol className="list-decimal list-inside text-xs text-stone-300 space-y-1.5 leading-relaxed pl-1">
                      <li>Bấm vào tab <strong>"Tải Source &amp; Copy"</strong> &gt; Tải file <code>thiep-cuoi-lovecard-thiepso01.html</code> về máy tính.</li>
                      <li>Đổi tên file thành <code>index.html</code>.</li>
                      <li>Cho file <code>index.html</code> vào một thư mục trống mới (ví dụ đặt tên thư mục là <code>thiep-cuoi</code>).</li>
                      <li>Truy cập <a href="https://app.netlify.com/drop" target="_blank" rel="noreferrer" className="text-amber-400 underline">netlify.com/drop</a> hoặc Vercel.</li>
                      <li>Kéo thả thư mục đó vào trình duyệt. Sau 10 giây bạn sẽ có ngay 1 trang web thiệp cưới online miễn phí có thể gửi cho bạn bè!</li>
                    </ol>
                  </div>

                  <div className="bg-stone-950/60 border border-stone-800 rounded-2xl p-5 space-y-3">
                    <h4 className="font-bold text-amber-300 flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Cách 2: Đưa lên Web Hosting / Tên miền riêng
                    </h4>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      Nếu bạn đã có hosting (cPanel, Hostinger, DirectAdmin...):
                      <br />
                      Chỉ cần upload file <code>index.html</code> vào thư mục <code>public_html</code> (hoặc thư mục con như <code>public_html/thiep-cuoi/</code>).
                      <br />
                      Khi đó đường dẫn thiệp sẽ là: <code>https://tenmiencuaban.com/thiep-cuoi/</code>.
                    </p>
                  </div>

                  <div className="bg-stone-950/60 border border-stone-800 rounded-2xl p-5 space-y-3">
                    <h4 className="font-bold text-amber-300 flex items-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Cách 3: Cách gửi link thiệp mời ghi đích danh tên từng người
                    </h4>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      Để thiệp hiển thị trang trọng tên từng khách mời, bạn chỉ cần thêm đuôi <code>?Ten=Tên_Khách</code> vào sau link:
                    </p>
                    <ul className="list-disc list-inside text-xs text-amber-200/90 space-y-1 pl-2">
                      <li>Gửi bạn Tuấn: <code>https://tenmien.com/?Ten=Bạn+Tuấn</code></li>
                      <li>Gửi gia đình Bác Năm: <code>https://tenmien.com/?Ten=Gia+đình+Bác+Năm</code></li>
                      <li>Gửi Anh Hoàng: <code>https://tenmien.com/?Ten=Anh+Hoàng</code></li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-stone-800 bg-stone-950 flex items-center justify-between">
              <span className="text-xs text-stone-400 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                Chúc hai bạn trăm năm hạnh phúc &amp; ngày vui viên mãn!
              </span>
              <button
                onClick={() => setIsOpenModal(false)}
                className="bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Hướng Dẫn & Mã Google Apps Script */}
      {showScriptModal && (
        <div
          className="fixed inset-0 z-[999999999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
          onClick={() => setShowScriptModal(false)}
        >
          <div
            className="bg-stone-900 border border-stone-700 text-stone-100 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-stone-800 bg-stone-950 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Mã Google Apps Script &amp; Cách Kết Nối</h3>
                  <p className="text-[11px] text-stone-400">Chỉ mất 1 phút để tạo bảng tính tự động lưu khách mời</p>
                </div>
              </div>
              <button
                onClick={() => setShowScriptModal(false)}
                className="w-7 h-7 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-stone-300">
              <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3.5 space-y-2">
                <h4 className="font-bold text-emerald-300 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  3 Bước Đơn Giản Để Bắt Đầu
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 leading-relaxed pl-1">
                  <li>
                    Tạo 1 bảng tính mới tại <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-emerald-400 underline font-semibold">sheets.new</a> (hoặc Google Drive).
                  </li>
                  <li>
                    Trên thanh menu, chọn <strong>Tiện ích mở rộng (Extensions)</strong> &gt; <strong>Apps Script</strong>.
                  </li>
                  <li>
                    Xóa toàn bộ nội dung cũ trong trình soạn thảo, bấm nút <strong>"Sao Chép Mã Apps Script"</strong> bên dưới rồi dán vào.
                  </li>
                  <li>
                    Bấm <strong>Triển khai (Deploy)</strong> &gt; <strong>Tùy chọn triển khai mới (New deployment)</strong> &gt; Chọn loại <strong>Ứng dụng web (Web app)</strong> &gt; Mục <em>"Ai có quyền truy cập (Who has access)"</em> chọn <strong>Bất kỳ ai (Anyone)</strong> &gt; Bấm <strong>Triển khai</strong>.
                  </li>
                  <li>
                    Sao chép URL Web App vừa tạo (có đuôi <code>/exec</code>) dán vào ô nhập trong tab <strong>Tùy Chỉnh Thiệp</strong>!
                  </li>
                </ol>
              </div>

              {/* Code viewer */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-xs flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-amber-400" />
                    Mã nguồn Code.gs (Đã bao gồm safeCell, LockService &amp; tự tạo sheet "Xác nhận tham dự"):
                  </span>
                  <button
                    onClick={handleCopyScript}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3 py-1 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedScript ? <Check className="w-3 h-3 stroke-[3]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedScript ? 'Đã Sao Chép!' : 'Sao Chép Mã'}</span>
                  </button>
                </div>

                <div className="bg-stone-950 border border-stone-800 rounded-xl p-3 font-mono text-[11px] text-stone-300 max-h-60 overflow-y-auto">
                  <pre className="whitespace-pre-wrap">{GOOGLE_APPS_SCRIPT_CODE}</pre>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-stone-800 bg-stone-950 flex items-center justify-end">
              <button
                onClick={() => setShowScriptModal(false)}
                className="bg-stone-800 hover:bg-stone-700 text-white font-medium px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

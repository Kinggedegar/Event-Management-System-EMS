// src/services/qrService.js
import jwt from 'jsonwebtoken';
import QRCode from 'qrcode';

const QR_SECRET = process.env.QR_SECRET;
if (!QR_SECRET) {
  throw new Error('QR_SECRET is required in .env (different from JWT_SECRET)');
}

const qrService = {
  /**
   * Returns both the signed JWS (for offline scanners) and a Data URL QR image
   */
  async generateForTicket(ticketId, userId) {
    const payload = {
      ticketId,
      userId,
      // No expiration → permanent for the event lifetime (as per spec)
    };

    const signedToken = jwt.sign(payload, QR_SECRET, { algorithm: 'HS256' });

    const qrDataUrl = await QRCode.toDataURL(signedToken, {
      errorCorrectionLevel: 'M',
      margin: 2,
      scale: 8,
      color: { dark: '#000000', light: '#FFFFFF' }
    });

    return {
      signedToken,   // scanners read this string
      qrCode: qrDataUrl   // frontend <img src={qrCode} />
    };
  },

  /**
   * Offline-verifiable by any scanner that knows QR_SECRET
   */
  verify(signedToken) {
    try {
      return jwt.verify(signedToken, QR_SECRET, { algorithms: ['HS256'] });
    } catch (err) {
      const message = err.name === 'JsonWebTokenError' ? 'Invalid ticket' : 'Ticket verification failed';
      const error = new Error(message);
      error.statusCode = 401;
      throw error;
    }
  }
};

export default qrService;
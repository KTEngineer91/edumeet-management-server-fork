# BreezeShot-EduMeet Secure Integration

This document describes the complete secure integration between BreezeShot and EduMeet using encrypted JWT tokens.

## Overview

The integration replaces the previous insecure URL parameter-based authentication with a secure token-based system that prevents URL manipulation and provides enhanced security.

## Architecture

### Before (Insecure)
```
BreezeShot Frontend → ?userKey=123&roomId=456&topicId=789 → EduMeet
```

### After (Secure)
```
BreezeShot Frontend → Generate Token → ?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... → EduMeet
```

## Implementation Components

### 1. BreezeShot Backend

#### Secure Token Service
- **File**: `src/services/v1/secureToken.service.ts`
- **Purpose**: Generates and validates JWT tokens
- **Features**:
  - 15-minute token expiration
  - HS256 algorithm signing
  - User and room validation

#### API Endpoints
- **Generate Token**: `POST /v1/topic-group/generate-access-token`
- **Validate Token**: `POST /v1/topic-group/validate-token`

### 2. BreezeShot Frontend

#### Secure Token Service
- **File**: `src/services/secureToken.ts`
- **Purpose**: Handles token generation and URL construction
- **Features**:
  - Async token generation
  - Error handling
  - Secure URL construction

#### Updated Join Flow
- **File**: `src/pages/app/dashboard/detail/[id].tsx`
- **Changes**: Replaced direct URL construction with secure token generation

### 3. EduMeet Backend

#### BreezeShot Validation Service
- **File**: `src/services/breezeShotValidation/breezeShotValidation.class.ts`
- **Purpose**: Validates tokens with BreezeShot backend
- **Features**:
  - HTTP client for BreezeShot API
  - Timeout handling
  - Error management

#### Token Validation Hook
- **File**: `src/hooks/validateBreezeShotToken.ts`
- **Purpose**: Validates tokens before room access
- **Features**:
  - Optional validation (backward compatibility)
  - User context injection
  - Error handling

## Security Features

### 1. Token Security
- **JWT Encryption**: Tokens are signed with HS256 algorithm
- **Time Expiration**: Tokens expire after 15 minutes
- **Tamper Proof**: Tokens cannot be modified without detection

### 2. Validation Process
1. **User Validation**: Check if user exists in BreezeShot
2. **Room Validation**: Verify user has access to specific room
3. **Ban Check**: Ensure user is not banned from topic
4. **Token Generation**: Create secure JWT token
5. **Token Validation**: EduMeet validates token with BreezeShot

### 3. Error Handling
- **Graceful Degradation**: System handles API failures
- **User Feedback**: Clear error messages for users
- **Logging**: Comprehensive error logging

## API Reference

### BreezeShot Backend Endpoints

#### Generate Access Token
```http
POST /v1/topic-group/generate-access-token
Content-Type: application/json

{
  "userKey": "user-key",
  "roomId": "room-id",
  "topicId": "topic-id"
}
```

**Response**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "15 minutes"
}
```

#### Validate Token
```http
POST /v1/topic-group/validate-token
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response**:
```json
{
  "success": true,
  "message": "Token valid",
  "user": { ... }
}
```

### EduMeet Backend Endpoints

#### Room Access with Token
```http
GET /rooms?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response**: Room data with validated user context

## Environment Configuration

### BreezeShot Backend
```bash
# .env.development.local
BREEZESHOT_SECRET_KEY=your-super-secret-key-for-token-generation
EDUMEET_API_URL=http://localhost:3030
EDUMEET_API_KEY=your-edumeet-api-key
```

### BreezeShot Frontend
```bash
# .env.local
NEXT_PUBLIC_EDUMEET_BASE_URL=https://stream.breezeshot.com/
NEXT_PUBLIC_EDUMEET_API_URL=http://localhost:3000
```

### EduMeet Backend
```bash
# config/default.json
{
  "breezeShot": {
    "apiUrl": "http://localhost:3000",
    "timeout": 5000
  }
}
```

## Deployment Steps

### 1. BreezeShot Backend
1. Deploy secure token service
2. Add environment variables
3. Generate secret key
4. Test token generation

### 2. BreezeShot Frontend
1. Deploy updated frontend
2. Update environment variables
3. Test secure URL generation

### 3. EduMeet Backend
1. Deploy validation service
2. Update configuration
3. Test token validation

## Testing

### Unit Tests
```bash
# BreezeShot Backend
npm test -- secure-token.test.ts

# EduMeet Backend
npm test -- breezeShotIntegration.test.ts
```

### Integration Tests
1. Start both services
2. Generate token in BreezeShot
3. Validate token in EduMeet
4. Test room access

## Migration Guide

### For Existing Users
1. **Backward Compatibility**: System supports both old and new authentication
2. **Gradual Migration**: Users will automatically use new system
3. **No User Action Required**: Seamless transition

### For Developers
1. **Update Frontend**: Use new token generation functions
2. **Update Backend**: Deploy validation services
3. **Update Configuration**: Add environment variables

## Troubleshooting

### Common Issues

#### Token Generation Fails
- Check BreezeShot backend is running
- Verify environment variables
- Check user permissions

#### Token Validation Fails
- Check EduMeet backend is running
- Verify BreezeShot API connectivity
- Check token expiration

#### Room Access Denied
- Verify user has room permissions
- Check user ban status
- Verify room exists

### Debug Steps
1. Check service logs
2. Verify API connectivity
3. Test token generation manually
4. Validate token manually

## Benefits

- ✅ **Enhanced Security**: Encrypted tokens prevent URL manipulation
- ✅ **Time Limited**: Tokens expire automatically
- ✅ **Audit Trail**: All access attempts are logged
- ✅ **Backward Compatible**: Existing functionality preserved
- ✅ **Client Requirement**: Meets security enhancement agreement
- ✅ **Scalable**: Can handle multiple integrations
- ✅ **Maintainable**: Clear separation of concerns

## Future Enhancements

1. **Token Refresh**: Automatic token renewal
2. **Rate Limiting**: Prevent token abuse
3. **Analytics**: Track usage patterns
4. **Monitoring**: Real-time health checks
5. **Caching**: Improve performance

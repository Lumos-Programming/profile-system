# LineOAuthResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**accessToken** | **string** | LINEから発行されたアクセストークン | [default to undefined]
**refreshToken** | **string** | 必要に応じて返されるリフレッシュトークン | [optional] [default to undefined]
**expiresIn** | **number** | アクセストークンの有効期限(秒) | [default to undefined]
**user** | [**LineUser**](LineUser.md) |  | [default to undefined]

## Example

```typescript
import { LineOAuthResponse } from './api';

const instance: LineOAuthResponse = {
    accessToken,
    refreshToken,
    expiresIn,
    user,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# DefaultApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiLineOauthGet**](#apilineoauthget) | **GET** /api/line-oauth | LINE OAuthコールバック|
|[**apiMembersGet**](#apimembersget) | **GET** /api/members | メンバー一覧を取得する|
|[**apiMembersIdGet**](#apimembersidget) | **GET** /api/members/{id} | メンバー詳細を取得する|
|[**apiProfileBasicInfoGet**](#apiprofilebasicinfoget) | **GET** /api/profile/basic-info | 基本情報を取得する|
|[**apiProfileBasicInfoPut**](#apiprofilebasicinfoput) | **PUT** /api/profile/basic-info | 基本情報を更新する|

# **apiLineOauthGet**
> LineOAuthResponse apiLineOauthGet()

LINEのOAuthコールバックURLとして、付与されたcodeをアクセストークンに交換し、認証済みユーザー情報を返します。

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let code: string; //LINE OAuth認可コード (default to undefined)
let state: string; //CSRF対策のstate値 (optional) (default to undefined)

const { status, data } = await apiInstance.apiLineOauthGet(
    code,
    state
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **code** | [**string**] | LINE OAuth認可コード | defaults to undefined|
| **state** | [**string**] | CSRF対策のstate値 | (optional) defaults to undefined|


### Return type

**LineOAuthResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | アクセストークンとユーザー情報の取得に成功 |  -  |
|**400** | 無効なcodeまたはstate |  -  |
|**500** | サーバーエラー |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiMembersGet**
> Array<MemberSummary> apiMembersGet()

サークルメンバーのサマリ情報一覧を返します。

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.apiMembersGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<MemberSummary>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 取得成功 |  -  |
|**500** | サーバーエラー |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiMembersIdGet**
> MemberDetail apiMembersIdGet()

指定したメンバーの詳細情報を返します。

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.apiMembersIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**MemberDetail**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 取得成功 |  -  |
|**404** | メンバーが見つかりません |  -  |
|**500** | サーバーエラー |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiProfileBasicInfoGet**
> BasicInfo apiProfileBasicInfoGet()

現在登録されているユーザーの基本情報を返します。

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.apiProfileBasicInfoGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**BasicInfo**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 取得成功 |  -  |
|**500** | サーバーエラー |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiProfileBasicInfoPut**
> UpdateResponse apiProfileBasicInfoPut(basicInfo)

学籍番号や名前、自己紹介などの基本情報を編集します。

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    BasicInfo
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let basicInfo: BasicInfo; //

const { status, data } = await apiInstance.apiProfileBasicInfoPut(
    basicInfo
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **basicInfo** | **BasicInfo**|  | |


### Return type

**UpdateResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 更新成功 |  -  |
|**400** | バリデーションエラー |  -  |
|**500** | サーバーエラー |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


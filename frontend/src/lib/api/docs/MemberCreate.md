# MemberCreate


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** |  | [default to undefined]
**nickname** | **string** |  | [default to undefined]
**department** | **string** |  | [default to undefined]
**year** | **string** |  | [default to undefined]
**bio** | **string** | Markdown形式の自己紹介 | [default to undefined]
**roles** | **Array&lt;string&gt;** |  | [default to undefined]
**avatar** | **string** |  | [optional] [default to undefined]
**accounts** | [**MemberCreateAccounts**](MemberCreateAccounts.md) |  | [default to undefined]
**links** | [**Array&lt;MemberDetailAllOfLinks&gt;**](MemberDetailAllOfLinks.md) |  | [optional] [default to undefined]

## Example

```typescript
import { MemberCreate } from './api';

const instance: MemberCreate = {
    name,
    nickname,
    department,
    year,
    bio,
    roles,
    avatar,
    accounts,
    links,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

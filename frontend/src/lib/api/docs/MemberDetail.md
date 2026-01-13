# MemberDetail


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [default to undefined]
**name** | **string** |  | [default to undefined]
**nickname** | **string** |  | [default to undefined]
**roles** | **Array&lt;string&gt;** |  | [default to undefined]
**avatar** | **string** |  | [optional] [default to undefined]
**department** | **string** |  | [default to undefined]
**year** | **string** |  | [default to undefined]
**bio** | **string** | Markdown形式の自己紹介 | [default to undefined]
**accounts** | [**MemberDetailAllOfAccounts**](MemberDetailAllOfAccounts.md) |  | [default to undefined]
**links** | [**Array&lt;MemberDetailAllOfLinks&gt;**](MemberDetailAllOfLinks.md) |  | [default to undefined]
**events** | [**Array&lt;MemberDetailAllOfEvents&gt;**](MemberDetailAllOfEvents.md) |  | [default to undefined]

## Example

```typescript
import { MemberDetail } from './api';

const instance: MemberDetail = {
    id,
    name,
    nickname,
    roles,
    avatar,
    department,
    year,
    bio,
    accounts,
    links,
    events,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

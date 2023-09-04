## Ason Frontend Readme.txt

Input Attributes
================
| Name                     | Description                             | Type          | Scope | Case edits |
|--|--|--|--|--|              
input.readOnlyStart        | start date is read only                 | bool          | start | all (start date) |
input.datePickerStart      | start picker date type 2)               | string        | start | date |
input.formatStart          | start date input format 9)              | string        | start | date, date-tim |
input.pickerStart          | start date datetime type 5)             | string        | start | all |
input.readOnlyEnd          | end date is read only                   | bool          | end   | all (end date) |
input.datePickerEnd        | end picker date type 2)                 | string        | end   | date |
input.formatEnd            | endt date input format 9)               | string        | end   | date, date-tim |
input.pickerEnd            | end date datetime type 5)               | string        | end   | all |
input.readOnly             | input is read only                      | bool          | value | all |
input.hidden               | input is hidden                         | bool          | value | all |
input.hiddenDescription    | input description is hidden             | bool          | value | all |
input.valueLabel           | input value placeholder text            | string        | value | all |
input.list                 | provide list of possible inputs         | dictionary    | value | all |
input.listSelection        | list of inputs & preselected value      | dictionary 4) | value | all |
input.listResult           | save key or value of list/listSelection | string 6)     | value | all |
input.culture              | the display culture/currency 1)         | string        | value | money |
input.sortOrder            | sorting order                           | int           | value | all |
input.minValue             | minimum input value                     | DateTime/num  | value | numeric, date, date-time |
input.maxValue             | maximum input value                     | DateTime/num  | value | numeric, date, date-time |
input.stepValue            | step size on spin buttons               | num           | value | numeric |
input.datePicker           | date picker date type 2)                | string        | value | date |
input.format               | input format 9)                         | string        | value | date, date-time |
input.mask                 | input mask 3)                           | string        | value | text |
input.multiLine            | show multiple text lines                | bool          | value | text |
input.maxLength            | maximum text length                     | int           | value | text |
input.switch               | use switch instead of checkbox          | bool          | value | boolean |
input.multiLookup          | able to pick multiple lookups           | bool          | value | lookups |
input.customValue          | able to enter custom lookup value       | bool          | value | lookups |
input.attachment           | enable document upload 7)               | string        | value | all |
input.attachmentExtensions | allowed files for upload 8)             | string        | value | all |
input.dayOfWeek            | converts int to day select combobox     | integer       | value | all |
input.month                | converts int to month select combobox   | integer       | value | all |

1\) culture names https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-lcid/a9eac961-e77d-41a6-90a5-ce1a8b0cdb9c

2\) date picker type: day (default), month, year

3\) text box input mask *

4\) JSON Object with attributes "dictionary" (type: dictionary<string, object>) and "selected" (type: string)

5\) DateTime type, valid values: DatePicker(default, date only), DateTimePicker(date and time)

6\) Accepted values: "Key" or "Value" 

7\) Accepted values: None, Optional, Mandatory

8\) Comma separated string, for example: .jpg,.png

9\) Date and time format
    Standard format strings: https://learn.microsoft.com/en-us/dotnet/standard/base-types/standard-date-and-time-format-strings
    Custom format strings: https://learn.microsoft.com/en-us/dotnet/standard/base-types/custom-date-and-time-format-strings

\
Text input mask
---------------
| Mask  | Description |
|--|--|
|0   | Digit required. This element will accept any single digit from 0 to 9 |
|9   | Digit or space, optional |
|\#   | Digit or space, optional, Plus(+) and minus(-) signs are allowed |
|L   | Letter required. It will accept letters a-z and A-Z |
|?   | Letter or space, optional |
|&   | Requires a character |
|C   | Character or space, optional |
|A   | Alphanumeric (A-Za-z0-9) required |
|a   | Alphanumeric (A-Za-z0-9) or space, optional |
|<   | Shift down. Converts all characters to lower case |
|\>   | Shift up. Converts all characters to upper case |

Escapes a mask character, turning it into a literal.
All other characters: Literals. All non-mask elements (literals) will appear as themselves within MaskedTextBox.

**Input Mask Examples**
| Mask  | Input |
|--|--|
| \#####    | 012+- |
| LLLLLL    | Sample |
| &&&&&     | A12# |
| \>LLL<LLL | SAMple |
| \\\A999   | A321 |

MaskedTextBox documentation: https://docs.microsoft.com/en-us/dotnet/api/system.windows.forms.maskedtextbox.mask

\
Date expressions
----------------
| Expression  | Description |
|--|--|
yesterday     | yesterday |
today         | today |
tomorrow      | tomorrow |
previousmonth | first day of previous month |
month         | first day of current month |
nextmonth     | first day of next month |
previousyear  | first day of previous calendar year |
year          | first day of current calendar year |
nextyear      | first day of next calendar year |
offset:<c><t> | offset from today* |
DateTime      | the date/time string representation, supported types: JSON and .net |

\*\<c> is the offset count
\<t> is the offset type
d = day | example 10 days: offset:10d
w = week | example 2 weeks: offset:2w
m = month | example 9 months: offset:9m
y = year | example 1 year: offset:1y

negative offset is also possible:
example minus 5 day: offset:-5d
example minus 6 weeks: offset:-6w
example minus 3 months: offset:-3m
example minus 4 years: offset:-4y

TimeSpan documentation: https://docs.microsoft.com/en-us/dotnet/api/system.timespan
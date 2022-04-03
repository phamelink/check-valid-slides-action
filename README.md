# Course Automation Github Action

## Example usage

```yml
# .github/worflows/my-workflow.yml
name: Check valid slides
"on":
  pull_request:
  workflow_dispatch:
jobs:
  changes:
    if: ${{ contains(github.event.*.labels.*.name, 'presentation') }}
    runs-on: ubuntu-latest
    steps:
      - uses: phamelink/check-valid-slides-action@v1
```

We chose here to only run this action if the PR is already labeledd a presentation, so as not to run for all PR.

---

## Use cases

For the KTH Devops Course, when students submit a presentation, they must make a pull request which contains either the PDF file of the slides they will use, or a link to them.
As such, this action will ensure that students who commit their presentation will be warned by a failing check if they have not submitted their slides.

## How this action works

First we needed to access the repository. This is why the first step in our action is _checkout_. This ensures that the runner can access the repository and the files that are being modified or added.

```yml
runs:
  using: "composite"
  steps:
    - uses: actions/checkout@v3
```

Then, we use _trilom/file-changes-action_ to have access to the names of the files that are being modified or added in the latest commit of the PR. The input _output_ here is simply the seperator in which we want the list of filenames. An empty string will ensure that the output filenames will be separated by a space.

```yml
- id: file_changes
      uses: trilom/file-changes-action@v1.2.3
      with:
        output: ""
```

Finally we run a few lines in bash, which will do the slides checking.

```bash
ADDED_FILES='${{ steps.file_changes.outputs.files_added}}'
MODIFIED_FILES='${{ steps.file_changes.outputs.files_modified}}'
ALL_FILES="$ADDED_FILES $MODIFIED_FILES"

IFS=" "

for fname in $ALL_FILES
do
    if grep -q "contributions/presentation/" <<< "$fname"; then
        if grep -q ".md" <<< "$fname" && grep "http://\|https://" $fname | grep -q -v "github"; then
            echo "HTTPS"
            exit 0
        fi
        if grep -q ".pdf" <<< "$fname"; then
            echo "PDF"
            exit 0
        fi
    fi
done
exit 1
```

First we combine all the files of interest to us in a single variable **ALL_FILES**. We then loop over each name, and if that filename is within the _presentation_ directory of the course, we look for a "http" or "https" string in the markdown, and ignore those that are part of a github link. We also check if a file is a PDF. If either of these conditions is fulfilled, we exit successfully. Otherwise, we exit on failure and the check on the PR will fail.

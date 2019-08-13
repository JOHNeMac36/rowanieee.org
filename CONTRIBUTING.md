# Contributing

## Development Workflow

This project utilizes several services that streamline the development for this website.

[Travis CI]: https://travis-ci.org/rowanieee/rowanieee.org
[Github Project]: https://github.com/rowanieee/rowanieee.org/projects
[Github Pages]: http://rowanieee.github.io/rowanieee.org

### Travis CI
Travis CI is a continuous-ingestion service that is linked to this repository and will build and test each commit to identify problematic commits before being merged into the
master branch. The Travis file `.travis.yaml` contains the instructions that tell Travis how to build and test the project. Travis also auto-generates the documentation for
this project too and pushes the documentation to this project's GitHub Pages branch `gh-pages`, which is then hosted at http://rowanieee.github.io/rowanieee.org .

### GitHub Project
GitHub projects are a way of tracking the progress and issues of the project and will automatically move tasks from TODO to Complete based on issues and pull requests. This
allows everyone to be on the same page about who is doing what and how much work has to get done in the current milestone.

### GitHub Pages
GitHub pages are freely hosted websites for GitHub repos and host anything pushed to the `gh-pages` branch. This project has build scripts that will auto generate
documentation and this documentation is automatically updated and hosted at http://rowanieee.github.io/rowanieee.org .

## The Contributing Process

0. You have an interest in learning about web development and/or contributing to the Rowan IEEE website
1. Join the Rowan IEEE Website Committee. Contact the current webmaster, John McAvoy mcavoyj5@students.rowan.edu if you aren't sure how to join
2. Once on the Website Committee, you will be able to contribute to this project
3. All tasks for this project are tracked using issues. Look at this project's issues page for a list of tasks that need to be completed. If you want to make an improvement that is not on the issue page, create your own issue describing what you intend to improve, then assign the issue to yourself.
4. Create a new branch named `#{issue_number}-{issue_title_snake_case}` and push your changes to this branch.
5. Create a new pull request for the branch and be sure to add the issue number in the pull request description so the issue gets tracked.
6. Once the pull request is reviewed, it will either be merged into the master branch or you will have to tweak your commits if needed.


# PR 评审

PR 评审使用**工作树模式（Worktree mode）**—— 在本地拉取 PR 分支，以便评审可以跨模块读取 PR 分支**精确版本**的相关代码。这对评审准确性至关重要。

## 参考文件

表格

|文件|用途|
|---|---|
|`code-checklist.md`|代码评审检查清单|
|`doc-checklist.md`|文档评审检查清单|
|`judgment-matrix.md`|是否值得修复的判定标准与特殊规则|
|`checklist-evolution.md`|检查清单更新流程与规则|

---

## 步骤 1：创建工作树

如果 `$ARGUMENTS` 是 URL，从中提取 PR 编号。

清理上一会话残留的工作树：

bash

运行

```
for dir in /tmp/pr-review-*; do
    [ -d "$dir" ] || continue
    n=$(basename "$dir" | sed 's/pr-review-//')
    git worktree remove "$dir" 2>/dev/null
    git branch -D "pr-${n}" 2>/dev/null
done
```

校验 PR 目标：

bash

运行

```
gh repo view --json nameWithOwner --jq .nameWithOwner
gh pr view {number} --json headRefName,baseRefName,headRefOid,state,body
```

记录 `OWNER_REPO`。提取：`PR_BRANCH`、`BASE_BRANCH`、`HEAD_SHA`、`STATE`、`PR_BODY`。

如果任一命令执行失败，告知用户并终止。

如果 `$ARGUMENTS` 是包含 `{owner}/{repo}` 的 URL，校验其是否与 `OWNER_REPO` 匹配。不匹配则告知用户不支持跨仓库 PR 评审并终止。

如果 `STATE` 不是 `OPEN`，告知用户并退出。

**如果当前分支等于 `PR_BRANCH` 且 HEAD 等于 `HEAD_SHA`**，跳过工作树创建 —— 代码已在本地。

**否则**，创建工作树：

bash

运行

```
git fetch origin pull/{number}/head:pr-{number}
git worktree add --no-track /tmp/pr-review-{number} pr-{number}
cd /tmp/pr-review-{number}
```

如果工作树创建失败，告知用户并终止。

---

## 步骤 2：收集差异与上下文

bash

运行

```
git fetch origin {BASE_BRANCH}
git merge-base origin/{BASE_BRANCH} HEAD
git diff <merge-base-sha>
```

如果差异超过 200 行，先执行 `git diff --stat` 获取概览，再使用 `git diff -- {file}` 按文件读取差异，避免输出被截断。

如果差异为空 → 清理工作树并退出。

拉取已有的 PR 评审评论用于去重：

bash

运行

```
gh api repos/{OWNER_REPO}/pulls/{number}/comments
```

---

## 步骤 3：评审

**内部分析**：

1. 基于差异，按需读取相关代码上下文，理解变更的正确性（如周边逻辑、基类、调用方）。
2. 阅读 `PR_BODY`，理解作者说明的动机。校验实现是否真正达成作者描述的目标。
3. 对代码文件应用 `code-checklist.md`，对文档文件应用 `doc-checklist.md`。使用 `judgment-matrix.md` 判断每个问题是否值得上报。
4. 检查之前 PR 评论中提出的问题是否已修复。
5. 对每个潜在问题，执行二次验证：重新阅读周边代码并确认 —— 别处是否有防护判断或提前返回处理了该问题？调用链是否保证了前置条件？我是否误解了生命周期或所有权？
6. **丢弃所有已排除的问题。只保留确认存在的问题。**
7. 将确认后的问题与现有 PR 评论去重。

**输出规则**：只向用户展示最终确认的问题。不输出分析过程、排除理由或已考虑但被排除的问题。

---

## 步骤 4：清理与报告

如果创建了工作树，进行清理：

bash

运行

```
cd -
git worktree remove /tmp/pr-review-{number}
git branch -D pr-{number}
```

向用户展示结果：

- 摘要：一段文字描述变更的目的与范围。
- 整体评估：代码质量评价与关键改进方向。
- 问题列表（如无问题则显示 “未发现问题”）。

如果无问题 → 询问是否**提交通过评审并合并 PR**：

1. 提交通过：
    
    bash
    
    运行
    
    ```
    gh api repos/{OWNER_REPO}/pulls/{number}/reviews --input - <<'EOF'
    {
      "commit_id": "{HEAD_SHA}",
      "event": "APPROVE"
    }
    EOF
    ```
    
2. 合并（压缩提交）：
    
    bash
    
    运行
    
    ```
    gh pr merge {number} --squash --delete-branch
    ```
    

如果用户拒绝，不执行任何操作。跳过下方评论提交步骤。

如果发现问题 → 按以下格式向用户展示确认后的问题：

plaintext

```
{N}. [{priority}] {file}:{line} — {问题描述与建议修复方案}
```

其中 `{priority}` 为检查清单条目 ID（如 A2、B1、C7）。

然后请用户通过**单次多选问题**选择要提交的问题，每个选项标签为问题摘要（如 `[A2] file:line — description`）。用户在一次提示中勾选多个选项。未勾选的问题跳过。

**必须**使用 `gh api` + heredoc。不使用 `gh pr comment`、`gh pr review` 或任何会创建非行级评论的命令：

bash

运行

```
gh api repos/{OWNER_REPO}/pulls/{number}/reviews --input - <<'EOF'
{
  "commit_id": "{HEAD_SHA}",
  "event": "COMMENT",
  "comments": [
    {
      "path": "relative/file/path",
      "line": 42,
      "side": "RIGHT",
      "body": "Description of the issue and suggested fix"
    }
  ]
}
EOF
```

- `commit_id`：PR 分支的 HEAD SHA
- `path`：相对于仓库根目录的路径
- `line`：**新文件**中的行号（差异右侧）。必须在步骤 3 中通过读取工作树中的实际文件确定 —— 不要从差异块偏移量推导。
- `side`：固定为 `"RIGHT"`
- `body`：简洁，使用用户对话语言，尽可能给出具体修复建议

输出：发现问题数 / 提交问题数 / 跳过问题数。

---

## 步骤 5：检查清单演进

回顾本次会话所有确认问题。如果任何问题代表当前检查清单未覆盖的**重复出现模式**，读取 `checklist-evolution.md` 并按步骤执行。
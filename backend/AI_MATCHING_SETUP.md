# AI Matching Setup Guide

This guide will help you set up the AI-powered candidate-project matching functionality for OPT-MAP.

## Prerequisites

- Python 3.8 or higher
- Node.js and npm (already installed for React app)
- Internet connection (for downloading AI models)

## Quick Setup

1. **Run the setup script:**
   ```bash
   python setup_ai.py
   ```

2. **Start the AI API server:**
   ```bash
   python api_server.py
   ```

3. **Start the React app (in a new terminal):**
   ```bash
   npm run dev
   ```

4. **Access AI Matching:**
   - Open http://localhost:8080
   - Navigate to "AI Matching" in the sidebar
   - Click "Run AI Matching" to analyze candidates

## Manual Setup

If the automated setup doesn't work, follow these steps:

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Test AI Model Loading

```bash
python -c "from ai_matching import AIMatcher; AIMatcher()"
```

### 3. Start the API Server

```bash
python api_server.py
```

The API will be available at `http://localhost:5000`

## How It Works

### AI Matching Algorithm

The AI matching system uses:

1. **Sentence Transformers**: For semantic skill matching
2. **Cosine Similarity**: To compare candidate skills with project requirements
3. **Weighted Scoring**: 
   - 50% Skills Match
   - 30% Availability Match
   - 20% Seniority Match

### Data Flow

1. React app sends candidate and project data to Python API
2. AI model analyzes skills using embeddings
3. System calculates fit scores for all combinations
4. Results are ranked and returned to React app
5. UI displays matches with detailed explanations

### API Endpoints

- `GET /api/health` - Health check
- `POST /api/match` - Match all candidates to all projects
- `POST /api/match/project/{id}` - Match candidates for specific project
- `POST /api/analyze/candidate/{id}` - Analyze specific candidate

## Troubleshooting

### Common Issues

1. **"API is not running" error:**
   - Make sure Python API server is running on port 5000
   - Check if port 5000 is available

2. **Model loading fails:**
   - Ensure internet connection for first-time model download
   - Check available disk space (models are ~100MB)

3. **Import errors:**
   - Verify all dependencies are installed: `pip list`
   - Try reinstalling: `pip install -r requirements.txt --force-reinstall`

4. **CORS errors:**
   - Make sure Flask-CORS is installed
   - Check browser console for specific error messages

### Performance Notes

- First run may be slow due to model download
- Subsequent runs are much faster
- Large datasets (>100 candidates) may take 10-30 seconds

## Features

### Smart Matching
- Semantic skill analysis using AI embeddings
- Availability and seniority consideration
- Detailed explanations for each match

### Interactive UI
- Real-time API status monitoring
- Tabbed interface for different projects
- Color-coded match scores
- Detailed candidate analysis

### Data Integration
- Uses existing mockData.ts
- No additional data preparation needed
- Seamless integration with current UI

## Development

### Adding New Matching Criteria

Edit `ai_matching.py` and modify the `calculate_fit_score` method:

```python
def calculate_fit_score(self, candidate: Dict, project: Dict) -> Dict:
    # Add your custom scoring logic here
    custom_score = self.calculate_custom_criteria(candidate, project)
    
    # Update weighted score
    fit_score = 0.4 * skill_match + 0.3 * availability_match + 0.2 * seniority_match + 0.1 * custom_score
```

### Modifying UI

Edit `src/pages/AIMatching.tsx` to customize the display of match results.

## Support

If you encounter issues:

1. Check the Python API server logs
2. Verify all dependencies are installed
3. Ensure ports 5000 and 8080 are available
4. Check browser console for JavaScript errors

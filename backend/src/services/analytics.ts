import { store } from "./store.js";

export function getAnalytics() {
  const emailsToday = store.emailThreads.filter((e) => isToday(e.receivedAt));
  const reviewsToday = store.reviews.filter((r) => isToday(r.date));

  const ratingDistribution = [1, 2, 3, 4, 5].map((rating) => ({
    rating,
    count: store.reviews.filter((r) => r.rating === rating).length,
  }));

  return {
    emails: {
      totalNewToday: emailsToday.filter((e) => e.state === "new").length,
      averageResponseTimeMinutes: 23,
      categoryBreakdown: countBy(emailsToday.map((e) => e.category)),
      sentimentBreakdown: countBy(emailsToday.map((e) => e.sentiment)),
    },
    reviews: {
      totalReviewsToday: reviewsToday.length,
      averageRating: store.reviews.length
        ? Number((store.reviews.reduce((sum, r) => sum + r.rating, 0) / store.reviews.length).toFixed(2))
        : 0,
      ratingDistribution,
      sentimentBreakdown: countBy(reviewsToday.map((r) => r.sentiment)),
      appComparison: store.apps.map((app) => ({
        appName: app.appName,
        totalReviews: store.reviews.filter((r) => r.appId === app.id).length,
        avgRating: avg(store.reviews.filter((r) => r.appId === app.id).map((r) => r.rating)),
      })),
    },
  };
}

function countBy(values: string[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}

function avg(values: number[]) {
  if (!values.length) return 0;
  return Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2));
}

function isToday(date: string) {
  return new Date(date).toDateString() === new Date().toDateString();
}
